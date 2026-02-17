import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TokenSelector } from './TokenSelector';
import { OrderBook } from './OrderBook';
import { TransactionFeed } from './TransactionFeed';
import { Token, OrderBook as OrderBookType, Transaction, PriceData } from '@/types/swap';
import { POPULAR_TOKENS, SLIPPAGE_OPTIONS } from '@utils/swapConstants';
import { generateId } from '@utils/helpers';
import { PriceChart } from './PriceChart';

export function SwapTerminal() {
    const [fromToken, setFromToken] = useState<Token>(POPULAR_TOKENS[0]);
    const [toToken, setToToken] = useState<Token>(POPULAR_TOKENS[1]);
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [slippage, setSlippage] = useState(0.5);
    const [customSlippage, setCustomSlippage] = useState('');
    const [isSwapping, setIsSwapping] = useState(false);
    const [priceData, setPriceData] = useState<PriceData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [orderBook, setOrderBook] = useState<OrderBookType>({
        bids: [],
        asks: [],
        spread: 0
    });

    // Simulate price data
    useEffect(() => {
        const basePrice = 2450.50;
        const updatePrice = () => {
            const change = (Math.random() - 0.5) * 10;
            setPriceData({
                pair: `${fromToken.symbol}/${toToken.symbol}`,
                price: basePrice + change,
                change24h: (Math.random() - 0.5) * 5,
                volume24h: Math.random() * 1000000,
                high24h: basePrice + Math.random() * 50,
                low24h: basePrice - Math.random() * 50,
                timestamp: Date.now()
            });
        };

        updatePrice();
        const interval = setInterval(updatePrice, 1000);
        return () => clearInterval(interval);
    }, [fromToken, toToken]);

    // Simulate order book
    useEffect(() => {
        const generateOrderBook = () => {
            const basePrice = priceData?.price || 2450;
            const bids = Array.from({ length: 20 }, (_, i) => {
                const price = basePrice - (i + 1) * 0.5;
                const amount = Math.random() * 10;
                return {
                    price,
                    amount,
                    total: price * amount
                };
            });

            const asks = Array.from({ length: 20 }, (_, i) => {
                const price = basePrice + (i + 1) * 0.5;
                const amount = Math.random() * 10;
                return {
                    price,
                    amount,
                    total: price * amount
                };
            });

            setOrderBook({
                bids,
                asks,
                spread: asks[0].price - bids[0].price
            });
        };

        if (priceData) {
            generateOrderBook();
            const interval = setInterval(generateOrderBook, 2000);
            return () => clearInterval(interval);
        }
    }, [priceData]);

    // Calculate toAmount when fromAmount changes
    useEffect(() => {
        if (fromAmount && priceData) {
            const calculated = (parseFloat(fromAmount) * priceData.price).toFixed(6);
            setToAmount(calculated);
        } else {
            setToAmount('');
        }
    }, [fromAmount, priceData]);

    const handleSwap = () => {
        // Swap tokens
        const tempToken = fromToken;
        setFromToken(toToken);
        setToToken(tempToken);

        // Swap amounts
        const tempAmount = fromAmount;
        setFromAmount(toAmount);
        setToAmount(tempAmount);
    };

    const handleExecuteSwap = async () => {
        if (!fromAmount || !toAmount) return;

        setIsSwapping(true);

        // Simulate transaction
        const newTransaction: Transaction = {
            id: generateId(),
            type: 'buy',
            fromToken: fromToken.symbol,
            toToken: toToken.symbol,
            fromAmount,
            toAmount,
            price: priceData?.price || 0,
            status: 'pending',
            timestamp: Date.now()
        };

        setTransactions(prev => [newTransaction, ...prev]);

        // Simulate confirmation after 2 seconds
        setTimeout(() => {
            setTransactions(prev =>
                prev.map(tx =>
                    tx.id === newTransaction.id
                        ? { ...tx, status: 'confirmed', txHash: generateId() }
                        : tx
                )
            );
            setIsSwapping(false);
            setFromAmount('');
            setToAmount('');
        }, 2000);
    };

    const handleMaxAmount = () => {
        if (fromToken.balance) {
            setFromAmount(fromToken.balance);
        }
    };

    return (
        <div className="flex flex-col h-full bg-terminal-dark p-4 overflow-hidden gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gradient mb-1">💱 Swap Terminal</h2>
                    <p className="text-terminal-gray-400 text-sm">
                        Professional trading interface with real-time market data
                    </p>
                </div>

                {priceData && (
                    <div className="glass rounded-lg px-4 py-2">
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="text-xs text-terminal-gray-500">Price</div>
                                <div className="text-xl font-bold text-cyber-cyan">
                                    ${priceData.price.toFixed(2)}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-terminal-gray-500">24h Change</div>
                                <div className={`text-xl font-bold ${priceData.change24h >= 0 ? 'text-cyber-green' : 'text-cyber-red'}`}>
                                    {priceData.change24h >= 0 ? '+' : ''}{priceData.change24h.toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
                {/* Left Panel - Order Book */}
                <div className="col-span-3 overflow-hidden">
                    <OrderBook orderBook={orderBook} />
                </div>

                {/* Center Panel - Swap Interface */}
                <div className="col-span-6 flex flex-col gap-4 overflow-auto scrollbar-hide">
                    {/* Swap Card */}
                    <motion.div
                        layout
                        className="glass-strong rounded-lg p-6"
                    >
                        <div className="space-y-4">
                            {/* From Token */}
                            <div className="glass rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-xs text-terminal-gray-400">From</label>
                                    <div className="text-xs text-terminal-gray-500">
                                        Balance: {fromToken.balance || '0.00'}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={fromAmount}
                                            onChange={(e) => setFromAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-transparent text-2xl font-bold text-white outline-none"
                                        />
                                        {fromAmount && priceData && (
                                            <div className="text-sm text-terminal-gray-500 mt-1">
                                                ≈ ${(parseFloat(fromAmount) * priceData.price).toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <TokenSelector
                                            selectedToken={fromToken}
                                            onSelect={setFromToken}
                                            excludeToken={toToken}
                                            label=""
                                        />
                                        <button
                                            onClick={handleMaxAmount}
                                            className="text-xs px-3 py-1 rounded bg-cyber-cyan bg-opacity-20 text-cyber-cyan hover:bg-opacity-30 transition-all"
                                        >
                                            MAX
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Swap Button */}
                            <div className="flex justify-center -my-2 relative z-10">
                                <motion.button
                                    onClick={handleSwap}
                                    whileHover={{ scale: 1.1, rotate: 180 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-full glass-strong flex items-center justify-center text-cyber-cyan hover:text-cyber-cyan-light transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </motion.button>
                            </div>

                            {/* To Token */}
                            <div className="glass rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-xs text-terminal-gray-400">To</label>
                                    <div className="text-xs text-terminal-gray-500">
                                        Balance: {toToken.balance || '0.00'}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={toAmount}
                                            readOnly
                                            placeholder="0.00"
                                            className="w-full bg-transparent text-2xl font-bold text-white outline-none"
                                        />
                                        {toAmount && priceData && (
                                            <div className="text-sm text-terminal-gray-500 mt-1">
                                                ≈ ${(parseFloat(toAmount)).toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                    <TokenSelector
                                        selectedToken={toToken}
                                        onSelect={setToToken}
                                        excludeToken={fromToken}
                                        label=""
                                    />
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="glass rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-terminal-gray-400">Slippage Tolerance</span>
                                    <div className="flex gap-2">
                                        {SLIPPAGE_OPTIONS.map((option) => (
                                            <button
                                                key={option.label}
                                                onClick={() => {
                                                    if (option.value === -1) {
                                                        // Custom slippage
                                                        setSlippage(-1);
                                                    } else {
                                                        setSlippage(option.value);
                                                    }
                                                }}
                                                className={`px-3 py-1 rounded text-xs transition-all ${slippage === option.value
                                                    ? 'bg-cyber-cyan text-terminal-dark'
                                                    : 'bg-terminal-gray-800 text-terminal-gray-400 hover:bg-terminal-gray-700'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {slippage === -1 && (
                                    <input
                                        type="text"
                                        value={customSlippage}
                                        onChange={(e) => setCustomSlippage(e.target.value)}
                                        placeholder="Enter custom slippage %"
                                        className="input w-full text-sm"
                                    />
                                )}

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-terminal-gray-400">Gas Estimate</span>
                                    <span className="text-terminal-gray-300 font-mono">~0.0045 ETH ($12.50)</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-terminal-gray-400">Route</span>
                                    <span className="text-terminal-gray-300 font-mono text-xs">
                                        {fromToken.symbol} → {toToken.symbol}
                                    </span>
                                </div>
                            </div>

                            {/* Execute Button */}
                            <motion.button
                                onClick={handleExecuteSwap}
                                disabled={!fromAmount || !toAmount || isSwapping}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${!fromAmount || !toAmount || isSwapping
                                    ? 'bg-terminal-gray-800 text-terminal-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-cyber-cyan to-cyber-magenta text-white hover:shadow-glow-cyan'
                                    }`}
                            >
                                {isSwapping ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Swapping...
                                    </span>
                                ) : (
                                    'Execute Swap'
                                )}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Price Chart */}
                    <div className="flex-1 min-h-[300px]">
                        <PriceChart pair={`${fromToken.symbol}/${toToken.symbol}`} />
                    </div>
                </div>

                {/* Right Panel - Transactions */}
                <div className="col-span-3 overflow-hidden">
                    <TransactionFeed transactions={transactions} />
                </div>
            </div>
        </div>
    );
}
