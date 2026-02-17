import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TIMEFRAMES } from '@utils/swapConstants';
import { CandleData } from '@/types/swap';

interface PriceChartProps {
    pair: string;
}

export function PriceChart({ pair }: PriceChartProps) {
    const [timeframe, setTimeframe] = useState('1h');
    const [candleData, setCandleData] = useState<CandleData[]>([]);
    const [chartType, setChartType] = useState<'candle' | 'line'>('candle');

    useEffect(() => {
        const generateCandles = () => {
            const candles: CandleData[] = [];
            let basePrice = 2450;
            const numCandles = 50;

            for (let i = 0; i < numCandles; i++) {
                const open = basePrice;
                const change = (Math.random() - 0.5) * 50;
                const close = open + change;
                const high = Math.max(open, close) + Math.random() * 20;
                const low = Math.min(open, close) - Math.random() * 20;
                const volume = Math.random() * 1000;

                candles.push({
                    timestamp: Date.now() - (numCandles - i) * 60000,
                    open,
                    high,
                    low,
                    close,
                    volume
                });

                basePrice = close;
            }

            setCandleData(candles);
        };

        generateCandles();
        const interval = setInterval(generateCandles, 5000);
        return () => clearInterval(interval);
    }, [timeframe]);

    const maxPrice = Math.max(...candleData.map(c => c.high));
    const minPrice = Math.min(...candleData.map(c => c.low));
    const priceRange = maxPrice - minPrice || 1; // Prevent division by zero

    const getY = (price: number) => {
        return ((maxPrice - price) / priceRange) * 100;
    };

    const maxVolume = Math.max(...candleData.map(c => c.volume));

    return (
        <div className="glass rounded-lg p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <h3 className="text-sm font-bold text-white">{pair}</h3>
                </div>

                <div className="flex gap-2">
                    {/* Chart Type */}
                    <div className="flex gap-1 glass rounded-lg p-1">
                        <button
                            onClick={() => setChartType('candle')}
                            className={`px-2 py-1 rounded text-xs transition-all ${chartType === 'candle'
                                ? 'bg-cyber-cyan text-terminal-dark'
                                : 'text-terminal-gray-400 hover:text-white'
                                }`}
                        >
                            Candles
                        </button>
                        <button
                            onClick={() => setChartType('line')}
                            className={`px-2 py-1 rounded text-xs transition-all ${chartType === 'line'
                                ? 'bg-cyber-cyan text-terminal-dark'
                                : 'text-terminal-gray-400 hover:text-white'
                                }`}
                        >
                            Line
                        </button>
                    </div>

                    {/* Timeframes */}
                    <div className="flex gap-1">
                        {TIMEFRAMES.map((tf) => (
                            <button
                                key={tf.value}
                                onClick={() => setTimeframe(tf.value)}
                                className={`px-3 py-1 rounded text-xs transition-all ${timeframe === tf.value
                                    ? 'bg-cyber-cyan text-terminal-dark'
                                    : 'bg-terminal-gray-800 text-terminal-gray-400 hover:bg-terminal-gray-700 hover:text-white'
                                    }`}
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart Container */}
            <div className="flex-1 relative min-h-0">
                <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((y) => (
                            <line
                                key={`grid-${y}`}
                                x1="0"
                                y1={y}
                                x2="100"
                                y2={y}
                                stroke="rgba(107, 107, 124, 0.1)"
                                strokeWidth="0.1"
                            />
                        ))}

                        {chartType === 'candle' ? (
                            <>
                                {/* Candlesticks */}
                                {candleData.map((candle, idx) => {
                                    const x = (idx / candleData.length) * 100;
                                    const width = (1 / candleData.length) * 100 * 0.8;
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
                                                strokeWidth="0.2"
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
                                })}
                            </>
                        ) : (
                            <>
                                {/* Line chart */}
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
                                {/* Area fill */}
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
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </>
                        )}
                    </svg>
                </div>

                {/* Y-axis labels - positioned absolutely */}
                <div className="absolute right-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-terminal-gray-500 font-mono py-2">
                    <div>${maxPrice.toFixed(0)}</div>
                    <div>${((maxPrice + minPrice) / 2).toFixed(0)}</div>
                    <div>${minPrice.toFixed(0)}</div>
                </div>
            </div>

            {/* Volume bars */}
            <div className="h-16 mt-2 relative flex items-end gap-px flex-shrink-0">
                {candleData.map((candle, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: idx * 0.01 }}
                        className={`flex-1 ${candle.close >= candle.open ? 'bg-cyber-green' : 'bg-cyber-red'
                            } opacity-40 hover:opacity-80 transition-opacity`}
                        style={{ height: `${(candle.volume / maxVolume) * 100}%` }}
                    />
                ))}
            </div>
        </div>
    );
}