import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SwapCalculation } from '@/hooks/useSwapCalculation';
import { PriceMap } from '@/hooks/usePrices';

interface ExplanationPanelProps {
    fromCurrency: string;
    toCurrency: string;
    calculation: SwapCalculation;
    prices: PriceMap;
    lastUpdated: Date | null;
    availableCurrencies: string[];
}

interface CandleData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

type Tab = 'calculation' | 'how-it-works' | 'market-data';

export function ExplanationPanel({
    fromCurrency,
    toCurrency,
    calculation,
    prices,
    lastUpdated,
    availableCurrencies,
}: ExplanationPanelProps) {
    const [activeTab, setActiveTab] = useState<Tab>('calculation');

    // Use real data: sort tokens by price (highest first)
    const topTokensByPrice = useMemo(() => {
        return availableCurrencies
            .map(currency => ({
                currency,
                price: prices[currency],
            }))
            .filter(token => token.price > 0)
            .sort((a, b) => b.price - a.price)
            .slice(0, 5);
    }, [availableCurrencies, prices]);

    const tabs = [
        { id: 'calculation' as Tab, label: 'Calculation', icon: '📊' },
        { id: 'how-it-works' as Tab, label: 'How It Works', icon: '💡' },
        { id: 'market-data' as Tab, label: 'Market Data', icon: '📈' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="terminal-card p-6 space-y-6"
        >
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-terminal-gray-800 pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all
                            ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-cyber-cyan to-cyber-blue text-terminal-dark'
                                : 'bg-terminal-gray-900 text-terminal-gray-400 hover:bg-terminal-gray-800'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
                {activeTab === 'calculation' && (
                    <CalculationTab
                        fromCurrency={fromCurrency}
                        toCurrency={toCurrency}
                        calculation={calculation}
                        prices={prices}
                    />
                )}

                {activeTab === 'how-it-works' && (
                    <HowItWorksTab
                        fromCurrency={fromCurrency}
                        toCurrency={toCurrency}
                    />
                )}

                {activeTab === 'market-data' && (
                    <MarketDataTab
                        fromCurrency={fromCurrency}
                        toCurrency={toCurrency}
                        prices={prices}
                        lastUpdated={lastUpdated}
                        topTokens={topTokensByPrice}
                    />
                )}
            </div>
        </motion.div>
    );
}

function CalculationTab({
    fromCurrency,
    toCurrency,
    calculation,
    prices,
}: {
    fromCurrency: string;
    toCurrency: string;
    calculation: SwapCalculation;
    prices: PriceMap;
}) {
    const fromAmount = parseFloat(calculation.fromAmount) || 0;

    if (fromAmount === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-terminal-gray-500">
                <div className="text-6xl mb-4">🔢</div>
                <p className="text-lg">Enter an amount to see the calculation breakdown</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h3 className="text-2xl font-bold text-gradient">
                Step-by-Step Calculation
            </h3>

            {/* Step 1: Input Value */}
            <div className="bg-terminal-gray-900 rounded-lg p-4 space-y-2">
                <div className="text-terminal-gray-400 text-sm font-medium">
                    Step 1: Calculate USD value of input
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-lg">
                        <span className="text-cyber-cyan font-bold">{fromAmount}</span>
                        <span className="text-terminal-gray-400 mx-2">×</span>
                        <span className="text-cyber-blue font-bold">
                            ${prices[fromCurrency]?.toFixed(2)}
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-cyber-cyan">
                        = ${calculation.fromUSD.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Step 2: Fee Deduction */}
            <div className="bg-terminal-gray-900 rounded-lg p-4 space-y-2">
                <div className="text-terminal-gray-400 text-sm font-medium">
                    Step 2: Deduct swap fee (0.3%)
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="text-terminal-gray-400">Initial USD value:</div>
                        <div className="font-mono">${calculation.fromUSD.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-terminal-gray-400">Fee (0.3%):</div>
                        <div className="font-mono text-yellow-400">
                            -${calculation.feeUSD.toFixed(2)}
                        </div>
                    </div>
                    <div className="border-t border-terminal-gray-800 pt-2 flex items-center justify-between">
                        <div className="text-terminal-gray-200 font-medium">After fees:</div>
                        <div className="text-2xl font-bold text-cyber-green">
                            ${calculation.toUSD.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 3: Convert to Output */}
            <div className="bg-terminal-gray-900 rounded-lg p-4 space-y-2">
                <div className="text-terminal-gray-400 text-sm font-medium">
                    Step 3: Convert to {toCurrency}
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-lg">
                        <span className="text-cyber-green font-bold">${calculation.toUSD.toFixed(2)}</span>
                        <span className="text-terminal-gray-400 mx-2">÷</span>
                        <span className="text-cyber-purple font-bold">
                            ${prices[toCurrency]?.toFixed(2)}
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-cyber-purple">
                        = {calculation.toAmount} {toCurrency}
                    </div>
                </div>
            </div>

            {/* Summary Box */}
            <div className="bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 border border-cyber-cyan/30 rounded-lg p-6">
                <div className="text-center space-y-4">
                    <div className="text-terminal-gray-400 text-sm">You receive</div>
                    <div className="text-5xl font-bold text-gradient">
                        {calculation.toAmount} {toCurrency}
                    </div>
                    <div className="text-terminal-gray-500 text-sm">
                        (≈ ${calculation.toUSD.toFixed(2)} after fees)
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function HowItWorksTab({
    fromCurrency,
    toCurrency,
}: {
    fromCurrency: string;
    toCurrency: string;
}) {
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    const terms = [
        {
            id: 'liquidity',
            term: 'Liquidity Pool',
            definition: 'A collection of tokens locked in a smart contract that enables trading. Users can swap between any tokens in the pool.'
        },
        {
            id: 'slippage',
            term: 'Slippage',
            definition: 'The difference between the expected price and the actual execution price. Larger trades cause more slippage.'
        },
        {
            id: 'fee',
            term: 'Trading Fee',
            definition: 'A small fee (0.3%) charged on each swap. This fee is distributed to liquidity providers as rewards.'
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h3 className="text-2xl font-bold text-gradient">
                How Token Swaps Work
            </h3>

            {/* Simple Explanation */}
            <div className="bg-terminal-gray-900 rounded-lg p-6 space-y-4">
                <p className="text-terminal-gray-300 leading-relaxed">
                    When you swap tokens, you're trading with a <span className="text-cyber-cyan font-semibold">liquidity pool</span> -
                    not with another person directly. Here's what happens:
                </p>

                <ol className="space-y-3 list-decimal list-inside text-terminal-gray-300">
                    <li>You send your {fromCurrency} tokens to the pool</li>
                    <li>The pool calculates how much {toCurrency} you should receive based on current prices</li>
                    <li>A small fee (0.3%) is deducted</li>
                    <li>You receive {toCurrency} tokens from the pool</li>
                </ol>
            </div>

            {/* Visual Flow */}
            <div className="bg-terminal-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    {/* You */}
                    <div className="text-center space-y-2">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyber-cyan to-cyber-blue rounded-full flex items-center justify-center text-3xl">
                            👤
                        </div>
                        <div className="text-sm text-terminal-gray-400">You</div>
                        <div className="text-xs text-cyber-cyan font-mono">
                            Send {fromCurrency}
                        </div>
                    </div>

                    {/* Arrow Right */}
                    <div className="flex-1 flex items-center justify-center">
                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-4xl text-cyber-cyan"
                        >
                            →
                        </motion.div>
                    </div>

                    {/* Pool */}
                    <div className="text-center space-y-2">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl">
                            🏊
                        </div>
                        <div className="text-sm text-terminal-gray-400">Liquidity Pool</div>
                        <div className="text-xs text-purple-400 font-mono">
                            Calculate & Apply Fee
                        </div>
                    </div>

                    {/* Arrow Left */}
                    <div className="flex-1 flex items-center justify-center">
                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-4xl text-cyber-green"
                        >
                            →
                        </motion.div>
                    </div>

                    {/* You */}
                    <div className="text-center space-y-2">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-3xl">
                            👤
                        </div>
                        <div className="text-sm text-terminal-gray-400">You</div>
                        <div className="text-xs text-cyber-green font-mono">
                            Receive {toCurrency}
                        </div>
                    </div>
                </div>
            </div>

            {/* Terms with Tooltips */}
            <div className="space-y-3">
                <h4 className="text-lg font-semibold text-terminal-gray-200">
                    Key Terms
                </h4>
                <div className="grid gap-3">
                    {terms.map((item) => (
                        <div
                            key={item.id}
                            className="bg-terminal-gray-900 rounded-lg p-4 cursor-pointer hover:bg-terminal-gray-800 transition-colors"
                            onMouseEnter={() => setActiveTooltip(item.id)}
                            onMouseLeave={() => setActiveTooltip(null)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-cyber-cyan">
                                    {item.term}
                                </span>
                                <span className="text-terminal-gray-500 text-sm">
                                    {activeTooltip === item.id ? '▼' : '▶'}
                                </span>
                            </div>
                            {activeTooltip === item.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-2 text-sm text-terminal-gray-400 leading-relaxed"
                                >
                                    {item.definition}
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function MarketDataTab({
    fromCurrency,
    toCurrency,
    prices,
    lastUpdated,
    topTokens,
}: {
    fromCurrency: string;
    toCurrency: string;
    prices: PriceMap;
    lastUpdated: Date | null;
    topTokens: Array<{ currency: string; price: number }>;
}) {
    const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '1M'>('24H');
    const [chartType, setChartType] = useState<'candle' | 'line'>('candle');

    // Get current prices for both tokens
    const fromPrice = prices[fromCurrency] || 0;
    const toPrice = prices[toCurrency] || 0;

    // Generate realistic candlestick data based on current price and timeframe
    const candleData = useMemo(() => {
        const currentPrice = fromPrice || 100;
        const candles: CandleData[] = [];

        // Configure based on timeframe
        let numCandles = 30;
        let interval = 3600000; // 1 hour in ms
        let volatility = 0.03;

        switch (timeframe) {
            case '1H':
                numCandles = 60; // 60 minutes
                interval = 60000; // 1 minute
                volatility = 0.01; // Lower volatility for short term
                break;
            case '24H':
                numCandles = 24; // 24 hours
                interval = 3600000; // 1 hour
                volatility = 0.03;
                break;
            case '7D':
                numCandles = 7; // 7 days
                interval = 86400000; // 1 day
                volatility = 0.08; // Higher volatility for longer term
                break;
            case '1M':
                numCandles = 30; // 30 days
                interval = 86400000; // 1 day
                volatility = 0.15; // Even higher volatility
                break;
        }

        let basePrice = currentPrice * (1 - volatility * 2); // Start lower for realistic movement

        for (let i = 0; i < numCandles; i++) {
            // Add trend and randomness
            const trend = Math.sin(i / (numCandles / 4)) * (currentPrice * volatility * 2);
            const randomWalk = (Math.random() - 0.5) * volatility * currentPrice * 3;

            const open = basePrice;
            const close = open + trend + randomWalk;
            const high = Math.max(open, close) + Math.random() * volatility * currentPrice;
            const low = Math.min(open, close) - Math.random() * volatility * currentPrice;

            // Volume varies with timeframe
            const volumeMultiplier = timeframe === '1H' ? 0.1 : timeframe === '24H' ? 1 : timeframe === '7D' ? 7 : 30;

            candles.push({
                timestamp: Date.now() - (numCandles - i) * interval,
                open,
                high,
                low,
                close,
                volume: (Math.random() * 1000000 + 500000) * volumeMultiplier,
            });

            basePrice = close;
        }

        return candles;
    }, [fromPrice, timeframe]); // Re-run when fromPrice changes

    const maxPrice = Math.max(...candleData.map(c => c.high));
    const minPrice = Math.min(...candleData.map(c => c.low));
    const priceRange = maxPrice - minPrice || 1;
    const maxVolume = Math.max(...candleData.map(c => c.volume));

    const getY = (price: number) => {
        return ((maxPrice - price) / priceRange) * 100;
    };

    // Calculate 24h change
    const priceChange24h = useMemo(() => {
        if (candleData.length < 2) return 0;
        const firstPrice = candleData[0].open;
        const lastPrice = candleData[candleData.length - 1].close;
        return ((lastPrice - firstPrice) / firstPrice) * 100;
    }, [candleData]);

    // Format date based on timeframe
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        switch (timeframe) {
            case '1H':
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            case '24H':
                return `${date.getHours()}:00`;
            case '7D':
                return date.toLocaleDateString([], { weekday: 'short' });
            case '1M':
                return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            default:
                return '';
        }
    };

    // Get X-axis labels (show fewer for readability)
    const xLabels = useMemo(() => {
        const step = Math.max(1, Math.floor(candleData.length / 6));
        return candleData.filter((_, i) => i % step === 0);
    }, [candleData]);

    return (
        <motion.div
            key={`${fromCurrency}-${toCurrency}`} // Force re-render when currencies change
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gradient">
                    Market Data
                </h3>
                {lastUpdated && (
                    <div className="text-xs text-terminal-gray-500">
                        Updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                )}
            </div>

            {/* Selected Tokens - Now fully dynamic */}
            <div className="grid grid-cols-2 gap-4">
                {/* From Currency */}
                <motion.div
                    key={fromCurrency}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-terminal-gray-900 rounded-lg p-4 space-y-3"
                >
                    <div className="flex items-center gap-2">
                        <img
                            src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${fromCurrency}.svg`}
                            alt={fromCurrency}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <div>
                            <div className="font-bold text-terminal-gray-100">
                                {fromCurrency}
                            </div>
                            <div className="text-xs text-terminal-gray-500">From</div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-terminal-gray-100">
                            ${fromPrice.toFixed(4)}
                        </div>
                        <div className="text-xs text-terminal-gray-500 flex items-center gap-2">
                            <span>24h Vol: ${(candleData.reduce((sum, c) => sum + c.volume, 0) / 1000000).toFixed(2)}M</span>
                            <span className={`text-xs ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {priceChange24h >= 0 ? '↑' : '↓'} {Math.abs(priceChange24h).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* To Currency */}
                <motion.div
                    key={toCurrency}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-terminal-gray-900 rounded-lg p-4 space-y-3"
                >
                    <div className="flex items-center gap-2">
                        <img
                            src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${toCurrency}.svg`}
                            alt={toCurrency}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <div>
                            <div className="font-bold text-terminal-gray-100">
                                {toCurrency}
                            </div>
                            <div className="text-xs text-terminal-gray-500">To</div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-terminal-gray-100">
                            ${toPrice.toFixed(4)}
                        </div>
                        <div className="text-xs text-terminal-gray-500">
                            Rate: 1 {fromCurrency} = {(fromPrice / toPrice).toFixed(4)} {toCurrency}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Candlestick Chart */}
            <motion.div
                key={`chart-${fromCurrency}-${timeframe}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-terminal-gray-900 rounded-lg p-4 space-y-4"
            >
                {/* Chart Header - Dynamic with token icons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <img
                                src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${fromCurrency}.svg`}
                                alt={fromCurrency}
                                className="w-5 h-5 rounded-full"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            <h4 className="font-semibold text-terminal-gray-200">
                                {fromCurrency}/{toCurrency}
                            </h4>
                        </div>
                        <div className="flex gap-1 bg-terminal-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setChartType('candle')}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${chartType === 'candle'
                                    ? 'bg-cyber-cyan text-terminal-dark shadow-glow-cyan'
                                    : 'text-terminal-gray-400 hover:text-terminal-gray-200'
                                    }`}
                            >
                                Candles
                            </button>
                            <button
                                onClick={() => setChartType('line')}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${chartType === 'line'
                                    ? 'bg-cyber-cyan text-terminal-dark shadow-glow-cyan'
                                    : 'text-terminal-gray-400 hover:text-terminal-gray-200'
                                    }`}
                            >
                                Line
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-1 bg-terminal-gray-800 rounded-lg p-1">
                        {(['1H', '24H', '7D', '1M'] as const).map((tf) => (
                            <button
                                key={tf}
                                onClick={() => setTimeframe(tf)}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${timeframe === tf
                                    ? 'bg-cyber-cyan text-terminal-dark shadow-glow-cyan'
                                    : 'text-terminal-gray-400 hover:text-terminal-gray-200'
                                    }`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart Area */}
                <div className="h-64 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {[0, 25, 50, 75, 100].map((y) => (
                            <div key={y} className="border-t border-terminal-gray-800 w-full h-0" />
                        ))}
                    </div>

                    {/* SVG Chart */}
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {chartType === 'candle' ? (
                            // Candlesticks
                            candleData.map((candle, idx) => {
                                const x = (idx / candleData.length) * 100;
                                const width = (1 / candleData.length) * 100 * 0.7;
                                const isGreen = candle.close >= candle.open;

                                const highY = getY(candle.high);
                                const lowY = getY(candle.low);
                                const openY = getY(candle.open);
                                const closeY = getY(candle.close);

                                return (
                                    <g key={idx}>
                                        {/* Wick */}
                                        <line
                                            x1={x + width / 2}
                                            y1={highY}
                                            x2={x + width / 2}
                                            y2={lowY}
                                            stroke={isGreen ? '#00ff9d' : '#ff0055'}
                                            strokeWidth="0.3"
                                            opacity="0.7"
                                        />
                                        {/* Body */}
                                        <rect
                                            x={x}
                                            y={Math.min(openY, closeY)}
                                            width={width}
                                            height={Math.max(Math.abs(closeY - openY), 0.5)}
                                            fill={isGreen ? '#00ff9d' : '#ff0055'}
                                            opacity="0.8"
                                        />
                                    </g>
                                );
                            })
                        ) : (
                            // Line chart
                            <>
                                <path
                                    d={candleData
                                        .map((candle, idx) => {
                                            const x = (idx / candleData.length) * 100;
                                            const y = getY(candle.close);
                                            return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                                        })
                                        .join(' ')}
                                    stroke="#00f0ff"
                                    strokeWidth="0.4"
                                    fill="none"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d={`
                                        ${candleData
                                            .map((candle, idx) => {
                                                const x = (idx / candleData.length) * 100;
                                                const y = getY(candle.close);
                                                return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                                            })
                                            .join(' ')}
                                        L 100 100 L 0 100 Z
                                    `}
                                    fill="url(#gradient)"
                                    opacity="0.2"
                                />
                            </>
                        )}
                    </svg>

                    {/* Y-axis labels */}
                    <div className="absolute right-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-terminal-gray-500 font-mono py-1">
                        <div>${maxPrice.toFixed(2)}</div>
                        <div>${((maxPrice + minPrice) / 2).toFixed(2)}</div>
                        <div>${minPrice.toFixed(2)}</div>
                    </div>

                    {/* Current price indicator */}
                    <div className="absolute left-0 right-0 border-t border-dashed border-cyber-cyan/30"
                        style={{ top: `${getY(fromPrice || maxPrice)}%` }}>
                        <div className="absolute right-0 -top-3 bg-cyber-cyan/20 px-2 py-0.5 rounded text-[10px] text-cyber-cyan">
                            Current: ${(fromPrice || 0).toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between text-xs text-terminal-gray-500 mt-2 px-2">
                    {xLabels.map((candle, i) => (
                        <span key={i}>{formatDate(candle.timestamp)}</span>
                    ))}
                </div>

                {/* Volume bars */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-terminal-gray-500">Volume</span>
                        <span className="text-xs text-terminal-gray-400">
                            Total: ${(candleData.reduce((sum, c) => sum + c.volume, 0) / 1000000).toFixed(2)}M
                        </span>
                    </div>
                    <div className="h-12 flex items-end gap-px">
                        {candleData.map((candle, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ height: 0 }}
                                animate={{ height: `${(candle.volume / maxVolume) * 100}%` }}
                                transition={{ delay: idx * 0.01 }}
                                className={`flex-1 ${candle.close >= candle.open ? 'bg-green-500/50' : 'bg-red-500/50'
                                    } hover:bg-opacity-80 transition-all cursor-pointer group relative`}
                                style={{ height: `${(candle.volume / maxVolume) * 100}%` }}
                            >
                                {/* Volume tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-terminal-dark border border-terminal-gray-700 rounded px-2 py-1 text-[10px] whitespace-nowrap">
                                    Vol: ${(candle.volume / 1000000).toFixed(2)}M
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Top Tokens by Price */}
            <div className="bg-terminal-gray-900 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-terminal-gray-200">
                    Highest Value Tokens
                </h4>
                <div className="space-y-2">
                    {topTokens.map((token, index) => (
                        <motion.div
                            key={token.currency}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-2 rounded hover:bg-terminal-gray-800 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-terminal-gray-500 font-mono text-sm w-4">
                                    #{index + 1}
                                </span>
                                <img
                                    src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.currency}.svg`}
                                    alt={token.currency}
                                    className="w-6 h-6 rounded-full"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                <span className="font-medium text-terminal-gray-200 group-hover:text-cyber-cyan transition-colors">
                                    {token.currency}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-mono text-terminal-gray-300">
                                    ${token.price.toFixed(4)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-terminal-gray-900 rounded-lg p-3 text-center">
                    <div className="text-xs text-terminal-gray-500">24h High</div>
                    <div className="text-lg font-bold text-cyber-cyan">
                        ${maxPrice.toFixed(2)}
                    </div>
                </div>
                <div className="bg-terminal-gray-900 rounded-lg p-3 text-center">
                    <div className="text-xs text-terminal-gray-500">24h Low</div>
                    <div className="text-lg font-bold text-cyber-pink">
                        ${minPrice.toFixed(2)}
                    </div>
                </div>
                <div className="bg-terminal-gray-900 rounded-lg p-3 text-center">
                    <div className="text-xs text-terminal-gray-500">24h Change</div>
                    <div className={`text-lg font-bold ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                    </div>
                </div>
            </div>
        </motion.div>
    );
}