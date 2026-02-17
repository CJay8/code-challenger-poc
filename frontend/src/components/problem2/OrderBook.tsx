import { motion } from 'framer-motion';
import { OrderBook as OrderBookType } from '@/types/swap';

interface OrderBookProps {
    orderBook: OrderBookType;
}

export function OrderBook({ orderBook }: OrderBookProps) {
    const maxTotal = Math.max(
        ...orderBook.bids.map(b => b.total),
        ...orderBook.asks.map(a => a.total)
    );

    return (
        <div className="glass rounded-lg p-4 h-full flex flex-col">
            <h3 className="text-sm font-bold text-cyber-cyan mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Order Book
            </h3>

            {/* Column Headers */}
            <div className="grid grid-cols-3 text-xs text-terminal-gray-500 font-medium mb-2 px-2">
                <div className="text-left">Price</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Total</div>
            </div>

            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                {/* Asks (Sell Orders) */}
                <div className="flex-1 flex flex-col-reverse overflow-y-auto scrollbar-hide">
                    {orderBook.asks.slice(0, 10).reverse().map((ask, idx) => (
                        <motion.div
                            key={`ask-${idx}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative grid grid-cols-3 text-xs py-1 px-2 hover:bg-white hover:bg-opacity-5 rounded"
                        >
                            <div
                                className="absolute inset-0 bg-cyber-red opacity-10 rounded"
                                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                            />
                            <div className="relative text-cyber-red font-mono">
                                {ask.price.toFixed(2)}
                            </div>
                            <div className="relative text-right text-terminal-gray-300 font-mono">
                                {ask.amount.toFixed(4)}
                            </div>
                            <div className="relative text-right text-terminal-gray-400 font-mono">
                                {ask.total.toFixed(2)}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Spread */}
                <div className="py-2 px-2 glass-strong rounded-lg">
                    <div className="text-center">
                        <div className="text-xs text-terminal-gray-500">Spread</div>
                        <div className="text-sm font-bold text-cyber-yellow">
                            {orderBook.spread.toFixed(2)} ({((orderBook.spread / orderBook.bids[0]?.price) * 100).toFixed(2)}%)
                        </div>
                    </div>
                </div>

                {/* Bids (Buy Orders) */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {orderBook.bids.slice(0, 10).map((bid, idx) => (
                        <motion.div
                            key={`bid-${idx}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative grid grid-cols-3 text-xs py-1 px-2 hover:bg-white hover:bg-opacity-5 rounded"
                        >
                            <div
                                className="absolute inset-0 bg-cyber-green opacity-10 rounded"
                                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                            />
                            <div className="relative text-cyber-green font-mono">
                                {bid.price.toFixed(2)}
                            </div>
                            <div className="relative text-right text-terminal-gray-300 font-mono">
                                {bid.amount.toFixed(4)}
                            </div>
                            <div className="relative text-right text-terminal-gray-400 font-mono">
                                {bid.total.toFixed(2)}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
