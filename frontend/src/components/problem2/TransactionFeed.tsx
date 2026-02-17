import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '@/types/swap';
import { formatDistanceToNow } from '@utils/helpers';

interface TransactionFeedProps {
    transactions: Transaction[];
}

export function TransactionFeed({ transactions }: TransactionFeedProps) {
    const getStatusColor = (status: Transaction['status']) => {
        switch (status) {
            case 'confirmed':
                return 'text-cyber-green';
            case 'pending':
                return 'text-cyber-yellow';
            case 'failed':
                return 'text-cyber-red';
        }
    };

    const getStatusIcon = (status: Transaction['status']) => {
        switch (status) {
            case 'confirmed':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'pending':
                return (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                );
            case 'failed':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
        }
    };

    return (
        <div className="glass rounded-lg p-4 h-full flex flex-col">
            <h3 className="text-sm font-bold text-cyber-magenta mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Live Transactions
            </h3>

            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
                <AnimatePresence mode="popLayout">
                    {transactions.map((tx, idx) => (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className="glass rounded-lg p-3 hover:border-cyber-cyan transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`${getStatusColor(tx.status)}`}>
                                        {getStatusIcon(tx.status)}
                                    </div>
                                    <span className={`text-xs font-medium capitalize ${getStatusColor(tx.status)}`}>
                                        {tx.status}
                                    </span>
                                </div>
                                <span className="text-xs text-terminal-gray-500">
                                    {formatDistanceToNow(tx.timestamp)}
                                </span>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-terminal-gray-400">From</span>
                                    <span className="font-mono text-white">
                                        {tx.fromAmount} {tx.fromToken}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center">
                                    <svg className="w-4 h-4 text-terminal-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-terminal-gray-400">To</span>
                                    <span className="font-mono text-cyber-cyan">
                                        {tx.toAmount} {tx.toToken}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-2 pt-2 border-t border-terminal-gray-700 flex items-center justify-between text-xs">
                                <span className="text-terminal-gray-500">Price</span>
                                <span className="font-mono text-terminal-gray-300">
                                    {tx.price.toFixed(4)}
                                </span>
                            </div>

                            {tx.txHash && (
                                <div className="mt-2 pt-2 border-t border-terminal-gray-700">
                                    <a
                                        href={`#/tx/${tx.txHash}`}
                                        className="text-xs text-cyber-cyan hover:text-cyber-cyan-light flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View on Explorer
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {transactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-terminal-gray-500 text-sm">
                        <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p>No recent transactions</p>
                    </div>
                )}
            </div>
        </div>
    );
}
