import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface PriceUpdate {
  pair: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
}

interface Client {
  ws: WebSocket;
  subscriptions: Set<string>;
}

export class PriceStreamService {
  private wss: WebSocketServer;
  private clients: Map<WebSocket, Client> = new Map();
  private prices: Map<string, PriceUpdate> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws/prices' });
    this.initializeWebSocket();
    this.startPriceUpdates();
  }

  private initializeWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket client connected');

      const client: Client = {
        ws,
        subscriptions: new Set()
      };

      this.clients.set(ws, client);

      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(client, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send initial prices
      this.sendPricesSnapshot(ws);
    });
  }

  private handleClientMessage(client: Client, message: any) {
    switch (message.type) {
      case 'subscribe':
        if (message.pairs && Array.isArray(message.pairs)) {
          message.pairs.forEach((pair: string) => {
            client.subscriptions.add(pair);
          });
        }
        break;

      case 'unsubscribe':
        if (message.pairs && Array.isArray(message.pairs)) {
          message.pairs.forEach((pair: string) => {
            client.subscriptions.delete(pair);
          });
        }
        break;

      case 'ping':
        client.ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
    }
  }

  private startPriceUpdates() {
    // Initialize some default pairs
    const pairs = ['ETH/USDC', 'ETH/USDT', 'WBTC/USDC', 'UNI/USDC', 'LINK/USDC'];
    
    pairs.forEach(pair => {
      this.prices.set(pair, {
        pair,
        price: this.getBasePrice(pair),
        change24h: (Math.random() - 0.5) * 10,
        volume24h: Math.random() * 10000000,
        timestamp: Date.now()
      });
    });

    // Update prices every 100ms
    this.updateInterval = setInterval(() => {
      this.updatePrices();
      this.broadcastPrices();
    }, 100);
  }

  private getBasePrice(pair: string): number {
    const basePrices: { [key: string]: number } = {
      'ETH/USDC': 2450,
      'ETH/USDT': 2448,
      'WBTC/USDC': 48500,
      'UNI/USDC': 12.5,
      'LINK/USDC': 18.3
    };
    return basePrices[pair] || 100;
  }

  private updatePrices() {
    this.prices.forEach((priceData, pair) => {
      // Random walk price movement
      const volatility = 0.001; // 0.1% per update
      const change = (Math.random() - 0.5) * 2 * volatility;
      const newPrice = priceData.price * (1 + change);

      this.prices.set(pair, {
        ...priceData,
        price: newPrice,
        change24h: priceData.change24h + change * 100,
        timestamp: Date.now()
      });
    });
  }

  private broadcastPrices() {
    const pricesArray = Array.from(this.prices.values());

    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        // Filter prices based on subscriptions
        const relevantPrices = client.subscriptions.size === 0
          ? pricesArray
          : pricesArray.filter(p => client.subscriptions.has(p.pair));

        if (relevantPrices.length > 0) {
          client.ws.send(JSON.stringify({
            type: 'price_update',
            data: relevantPrices,
            timestamp: Date.now()
          }));
        }
      }
    });
  }

  private sendPricesSnapshot(ws: WebSocket) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'snapshot',
        data: Array.from(this.prices.values()),
        timestamp: Date.now()
      }));
    }
  }

  public getCurrentPrices() {
    return Array.from(this.prices.values());
  }

  public getPriceForPair(pair: string): PriceUpdate | undefined {
    return this.prices.get(pair);
  }

  public stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.wss.close();
  }
}
