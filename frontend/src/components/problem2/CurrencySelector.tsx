import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CurrencySelectorProps {
    currencies: string[];
    selected: string;
    onChange: (currency: string) => void;
    exclude?: string;
}

export function CurrencySelector({
    currencies,
    selected,
    onChange,
    exclude,
}: CurrencySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const filteredCurrencies = currencies.filter(c => c !== exclude);

    const getIconUrl = (currency: string) => {
        return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`;
    };

    const handleSelect = (currency: string) => {
        onChange(currency);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-terminal-gray-800 hover:bg-terminal-gray-700 rounded-lg transition-colors border border-terminal-gray-700"
            >
                <img
                    src={getIconUrl(selected)}
                    alt={selected}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2300f0ff" stroke-width="2"%3E%3Ccircle cx="12" cy="12" r="10"/%3E%3Ctext x="12" y="16" text-anchor="middle" fill="%2300f0ff" font-size="10" font-weight="bold"%3E%3F%3C/text%3E%3C/svg%3E';
                    }}
                />
                <span className="font-bold text-terminal-gray-100">{selected}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-terminal-gray-400"
                >
                    ▼
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full mt-2 left-0 w-64 max-h-80 overflow-y-auto bg-terminal-gray-900 border border-terminal-gray-700 rounded-lg shadow-xl z-50"
                        >
                            <div className="p-2">
                                <input
                                    type="text"
                                    placeholder="Search currency..."
                                    className="w-full px-3 py-2 bg-terminal-gray-800 text-terminal-gray-100 rounded-lg outline-none border border-terminal-gray-700 focus:border-cyber-cyan text-sm mb-2"
                                    onClick={(e) => e.stopPropagation()}
                                />

                                <div className="space-y-1">
                                    {filteredCurrencies.map((currency) => (
                                        <button
                                            key={currency}
                                            onClick={() => handleSelect(currency)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left
                        ${selected === currency
                                                    ? 'bg-cyber-cyan/20 text-cyber-cyan'
                                                    : 'hover:bg-terminal-gray-800 text-terminal-gray-200'
                                                }`}
                                        >
                                            <img
                                                src={getIconUrl(currency)}
                                                alt={currency}
                                                className="w-6 h-6 rounded-full"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2300f0ff" stroke-width="2"%3E%3Ccircle cx="12" cy="12" r="10"/%3E%3Ctext x="12" y="16" text-anchor="middle" fill="%2300f0ff" font-size="10" font-weight="bold"%3E%3F%3C/text%3E%3C/svg%3E';
                                                }}
                                            />
                                            <span className="font-medium">{currency}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
