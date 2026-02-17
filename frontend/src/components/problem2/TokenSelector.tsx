import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Token } from '@/types/swap';
import { POPULAR_TOKENS } from '@utils/swapConstants';

interface TokenSelectorProps {
    selectedToken: Token | null;
    onSelect: (token: Token) => void;
    excludeToken?: Token;
    label: string;
}

export function TokenSelector({ selectedToken, onSelect, excludeToken, label }: TokenSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTokens = POPULAR_TOKENS.filter(token => {
        if (excludeToken && token.symbol === excludeToken.symbol) return false;
        if (searchQuery) {
            return token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    return (
        <div className="relative">
            <label className="block text-xs text-terminal-gray-400 mb-2">{label}</label>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full glass rounded-lg px-4 py-3 flex items-center justify-between hover:border-cyber-cyan transition-all"
            >
                {selectedToken ? (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-magenta flex items-center justify-center font-bold text-sm">
                            {selectedToken.symbol[0]}
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-white">{selectedToken.symbol}</div>
                            <div className="text-xs text-terminal-gray-400">{selectedToken.name}</div>
                        </div>
                    </div>
                ) : (
                    <span className="text-terminal-gray-500">Select token</span>
                )}
                <svg className="w-5 h-5 text-terminal-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full mt-2 left-0 right-0 glass-strong rounded-lg overflow-hidden z-50 max-h-96"
                        >
                            <div className="p-3 border-b border-terminal-gray-700">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search tokens..."
                                    className="input w-full"
                                    autoFocus
                                />
                            </div>
                            <div className="max-h-80 overflow-y-auto scrollbar-hide">
                                {filteredTokens.map((token) => (
                                    <button
                                        key={token.symbol}
                                        onClick={() => {
                                            onSelect(token);
                                            setIsOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white hover:bg-opacity-5 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-magenta flex items-center justify-center font-bold">
                                                {token.symbol[0]}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-white">{token.symbol}</div>
                                                <div className="text-xs text-terminal-gray-400">{token.name}</div>
                                            </div>
                                        </div>
                                        {token.balance && (
                                            <div className="text-right">
                                                <div className="text-sm text-terminal-gray-300">{token.balance}</div>
                                                <div className="text-xs text-terminal-gray-500">Balance</div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
