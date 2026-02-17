import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrices } from '@/hooks/usePrices';
import { useSwapCalculation } from '@/hooks/useSwapCalculation';
import { CurrencySelector } from '@/components/problem2/CurrencySelector';
import { ExplanationPanel } from '@/components/problem2/ExplanationPanel';
import { Skeleton } from '@/components/shared/LoadingSkeleton';

export function CurrencySwapForm() {
    const { prices, loading, error, lastUpdated } = usePrices();
    const [fromCurrency, setFromCurrency] = useState('ETH');
    const [toCurrency, setToCurrency] = useState('USDC');
    const [isSwapping, setIsSwapping] = useState(false);
    const [swapSuccess, setSwapSuccess] = useState(false);
    const [txHash, setTxHash] = useState('');

    const {
        fromAmount,
        calculation,
        updateFromAmount,
    } = useSwapCalculation(fromCurrency, toCurrency, prices);

    const availableCurrencies = useMemo(() => {
        return Object.keys(prices).filter(currency => prices[currency] > 0);
    }, [prices]);

    const canSwap = useMemo(() => {
        const amount = parseFloat(fromAmount) || 0;
        return (
            amount > 0 &&
            fromCurrency !== toCurrency &&
            !loading &&
            !isSwapping
        );
    }, [fromAmount, fromCurrency, toCurrency, loading, isSwapping]);

    const handleFlipCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const handleSwap = async () => {
        if (!canSwap) return;

        setIsSwapping(true);
        setSwapSuccess(false);

        // Simulate transaction (this is fine - it's simulating blockchain)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate fake tx hash (this is fine - simulating blockchain response)
        const hash = '0x' + Math.random().toString(16).substring(2, 42).padEnd(40, '0');
        setTxHash(hash);
        setSwapSuccess(true);
        setIsSwapping(false);

        // Reset success message after 5 seconds
        setTimeout(() => {
            setSwapSuccess(false);
        }, 5000);
    };

    if (loading) {
        return (
            <div className="h-full overflow-auto bg-gradient-to-br from-terminal-dark via-terminal-darker to-terminal-dark p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Skeleton className="h-[600px]" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full overflow-auto bg-gradient-to-br from-terminal-dark via-terminal-darker to-terminal-dark p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="terminal-card p-8 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Prices</h2>
                        <p className="text-terminal-gray-400 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-blue text-terminal-dark font-bold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto bg-gradient-to-br from-terminal-dark via-terminal-darker to-terminal-dark p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-6"
            >
                {/* Header */}
                <div className="text-center space-y-2">
                    <motion.h1
                        className="text-4xl font-bold text-gradient"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                    >
                        💱 Currency Swap
                    </motion.h1>
                    <p className="text-terminal-gray-400">
                        Trade tokens instantly with real-time rates from Switcheo
                    </p>
                    {lastUpdated && (
                        <p className="text-xs text-terminal-gray-500">
                            Prices updated: {new Date(lastUpdated).toLocaleString()}
                        </p>
                    )}
                </div>

                {/* Swap Card */}
                <motion.div
                    className="terminal-card p-6 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* FROM Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-terminal-gray-400">
                                From
                            </label>
                            {/* Removed balance display since no mock data */}
                        </div>

                        <div className="bg-terminal-gray-900 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <CurrencySelector
                                    currencies={availableCurrencies}
                                    selected={fromCurrency}
                                    onChange={setFromCurrency}
                                    exclude={toCurrency}
                                />
                                <input
                                    type="text"
                                    value={fromAmount}
                                    onChange={(e) => updateFromAmount(e.target.value)}
                                    placeholder="0.0"
                                    className="flex-1 bg-transparent text-3xl font-bold text-terminal-gray-100 outline-none text-right"
                                />
                            </div>

                            {fromAmount && parseFloat(fromAmount) > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-right text-terminal-gray-500 text-sm"
                                >
                                    ≈ ${calculation.fromUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Flip Button */}
                    <div className="flex justify-center">
                        <motion.button
                            onClick={handleFlipCurrencies}
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 bg-terminal-gray-800 hover:bg-terminal-gray-700 rounded-full flex items-center justify-center text-2xl transition-colors border-2 border-terminal-gray-700"
                        >
                            ⇅
                        </motion.button>
                    </div>

                    {/* TO Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-terminal-gray-400">
                            To
                        </label>

                        <div className="bg-terminal-gray-900 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <CurrencySelector
                                    currencies={availableCurrencies}
                                    selected={toCurrency}
                                    onChange={setToCurrency}
                                    exclude={fromCurrency}
                                />
                                <div className="flex-1 text-3xl font-bold text-terminal-gray-100 text-right">
                                    {calculation.toAmount}
                                </div>
                            </div>

                            {calculation.toUSD > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-right text-terminal-gray-500 text-sm"
                                >
                                    ≈ ${calculation.toUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Exchange Rate */}
                    {calculation.exchangeRate !== '0' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-terminal-gray-900 rounded-lg p-3 flex items-center justify-between text-sm"
                        >
                            <span className="text-terminal-gray-400">Exchange Rate</span>
                            <span className="text-terminal-gray-100 font-medium">
                                1 {fromCurrency} = {parseFloat(calculation.exchangeRate).toFixed(6)} {toCurrency}
                            </span>
                        </motion.div>
                    )}

                    {/* Swap Button */}
                    <button
                        onClick={handleSwap}
                        disabled={!canSwap}
                        className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform
                            ${canSwap
                                ? 'bg-gradient-to-r from-cyber-cyan to-cyber-blue hover:opacity-90 hover:scale-105 text-terminal-dark'
                                : 'bg-terminal-gray-800 text-terminal-gray-600 cursor-not-allowed'
                            }`}
                    >
                        {isSwapping ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">⚙️</span>
                                <span>Swapping...</span>
                            </span>
                        ) : fromCurrency === toCurrency ? (
                            'Select different currencies'
                        ) : parseFloat(fromAmount) <= 0 ? (
                            'Enter amount'
                        ) : (
                            `Swap ${fromCurrency} for ${toCurrency}`
                        )}
                    </button>

                    {/* Success Message */}
                    <AnimatePresence>
                        {swapSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">✅</span>
                                    <div className="flex-1">
                                        <div className="font-bold text-green-400 mb-1">
                                            Swap Successful!
                                        </div>
                                        <div className="text-sm text-terminal-gray-400 mb-2">
                                            Swapped {fromAmount} {fromCurrency} for {calculation.toAmount} {toCurrency}
                                        </div>
                                        <div className="text-xs text-terminal-gray-500 font-mono break-all">
                                            Tx: {txHash}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Explanation Panel */}
                <ExplanationPanel
                    fromCurrency={fromCurrency}
                    toCurrency={toCurrency}
                    calculation={calculation}
                    prices={prices}
                    lastUpdated={lastUpdated}
                    availableCurrencies={availableCurrencies}
                />
            </motion.div>
        </div>
    );
}