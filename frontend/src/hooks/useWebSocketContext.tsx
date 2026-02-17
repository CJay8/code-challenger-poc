import { createContext, useContext, ReactNode, useState, useEffect, useRef, useCallback } from 'react';

export enum WebSocketStatus {
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
    ERROR = 'error',
}

interface PriceUpdate {
    pair: string;
    price: number;
    change24h: number;
    volume24h: number;
    timestamp: number;
}

interface WebSocketContextValue {
    status: WebSocketStatus;
    subscribe: (pairs: string[]) => void;
    unsubscribe: (pairs: string[]) => void;
    prices: PriceUpdate[];
    connectionInfo: {
        attemptReconnect: () => void;
        disconnect: () => void;
    };
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

interface WebSocketProviderProps {
    children: ReactNode;
    url?: string;
}

export function WebSocketProvider({ children, url = 'ws://localhost:3001/ws/prices' }: WebSocketProviderProps) {
    const [status, setStatus] = useState<WebSocketStatus>(WebSocketStatus.DISCONNECTED);
    const [prices, setPrices] = useState<PriceUpdate[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const subscribedPairsRef = useRef<Set<string>>(new Set());
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 10;

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            setStatus(WebSocketStatus.CONNECTING);
            const ws = new WebSocket(url);

            ws.onopen = () => {
                console.log('WebSocket connected to price stream');
                setStatus(WebSocketStatus.CONNECTED);
                reconnectAttemptsRef.current = 0;

                // Resubscribe to all pairs after reconnection
                if (subscribedPairsRef.current.size > 0) {
                    ws.send(JSON.stringify({
                        type: 'subscribe',
                        pairs: Array.from(subscribedPairsRef.current)
                    }));
                }

                // Send heartbeat every 30s
                const heartbeatInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'ping' }));
                    } else {
                        clearInterval(heartbeatInterval);
                    }
                }, 30000);
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);

                    switch (message.type) {
                        case 'snapshot':
                        case 'price_update':
                            if (Array.isArray(message.data)) {
                                setPrices(message.data as PriceUpdate[]);
                            }
                            break;
                        case 'pong':
                            // Heartbeat acknowledged
                            break;
                        default:
                            console.log('Unknown message type:', message.type);
                    }
                } catch (err) {
                    console.error('Failed to parse WebSocket message:', err);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setStatus(WebSocketStatus.ERROR);
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                setStatus(WebSocketStatus.DISCONNECTED);

                // Attempt to reconnect with exponential backoff
                if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
                    reconnectAttemptsRef.current += 1;

                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log(`Reconnecting... (attempt ${reconnectAttemptsRef.current})`);
                        connect();
                    }, delay);
                }
            };

            wsRef.current = ws;
        } catch (err) {
            console.error('Failed to create WebSocket:', err);
            setStatus(WebSocketStatus.ERROR);
        }
    }, [url]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setStatus(WebSocketStatus.DISCONNECTED);
        reconnectAttemptsRef.current = maxReconnectAttempts; // Prevent auto-reconnect
    }, []);

    const subscribe = useCallback((pairs: string[]) => {
        pairs.forEach(pair => subscribedPairsRef.current.add(pair));

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'subscribe',
                pairs
            }));
        }
    }, []);

    const unsubscribe = useCallback((pairs: string[]) => {
        pairs.forEach(pair => subscribedPairsRef.current.delete(pair));

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'unsubscribe',
                pairs
            }));
        }
    }, []);

    // Auto-connect on mount
    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connect]);

    const contextValue: WebSocketContextValue = {
        status,
        subscribe,
        unsubscribe,
        prices,
        connectionInfo: {
            attemptReconnect: connect,
            disconnect
        }
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocketContext() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within WebSocketProvider');
    }
    return context;
}

// Convenience hook for subscribing to specific pairs
export function usePriceStream(pairs: string[]) {
    const { subscribe, unsubscribe, prices } = useWebSocketContext();

    useEffect(() => {
        subscribe(pairs);
        return () => unsubscribe(pairs);
    }, [pairs.join(','), subscribe, unsubscribe]); // eslint-disable-line react-hooks/exhaustive-deps

    // Filter to only subscribed pairs
    const filteredPrices = prices.filter(p => pairs.includes(p.pair));

    return filteredPrices;
}
