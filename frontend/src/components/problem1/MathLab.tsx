import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sumToNIterative, sumToNFormula, sumToNRecursive } from '@utils/mathOperations';

type Method = 'iterative' | 'formula' | 'recursive';

interface MethodInfo {
    id: Method;
    name: string;
    icon: string;
    color: string;
    glowColor: string;
    timeComplexity: string;
    spaceComplexity: string;
    description: string;
    code: string;
    pros: string[];
    cons: string[];
}

const METHODS: MethodInfo[] = [
    {
        id: 'iterative',
        name: 'Loop Method',
        icon: '🔄',
        color: 'from-cyan-500 to-blue-500',
        glowColor: 'rgba(0, 240, 255, 0.5)',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        description: 'Iterates through numbers 1 to n, adding each to a running sum',
        code: `function sumToNIterative(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}`,
        pros: ['Easy to understand', 'Constant space', 'No recursion overhead'],
        cons: ['Slower for large n', 'O(n) time complexity']
    },
    {
        id: 'formula',
        name: 'Formula Method',
        icon: '⚡',
        color: 'from-yellow-500 to-orange-500',
        glowColor: 'rgba(255, 200, 0, 0.5)',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        description: 'Uses Gauss formula: n × (n + 1) / 2',
        code: `function sumToNFormula(n: number): number {
  return (n * (n + 1)) / 2;
}`,
        pros: ['Instant calculation', 'O(1) time', 'Most efficient'],
        cons: ['Requires knowledge of formula', 'Less intuitive']
    },
    {
        id: 'recursive',
        name: 'Recursion Method',
        icon: '♾️',
        color: 'from-purple-500 to-pink-500',
        glowColor: 'rgba(200, 0, 255, 0.5)',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        description: 'Calls itself with n-1 until reaching base case',
        code: `function sumToNRecursive(n: number): number {
  if (n <= 1) return n;
  return n + sumToNRecursive(n - 1);
}`,
        pros: ['Elegant solution', 'Good for teaching recursion'],
        cons: ['Stack overflow risk', 'O(n) space', 'Slowest method']
    }
];

const PRESETS = [10, 50, 100, 500, 1000];

export function MathLab() {
    const [n, setN] = useState(10);
    const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
    const [hoveredMethod, setHoveredMethod] = useState<Method | null>(null);
    const [raceMode, setRaceMode] = useState(false);
    const [results, setResults] = useState<Record<Method, { result: number; time: number; steps: number }>>({
        iterative: { result: 0, time: 0, steps: 0 },
        formula: { result: 0, time: 0, steps: 0 },
        recursive: { result: 0, time: 0, steps: 0 }
    });
    const [progress, setProgress] = useState<Record<Method, number>>({
        iterative: 0,
        formula: 0,
        recursive: 0
    });

    // Calculate results when n changes
    useEffect(() => {
        // Iterative
        const iterativeCalc = sumToNIterative(n);

        // Formula
        const formulaCalc = sumToNFormula(n);

        // Recursive
        const recursiveCalc = sumToNRecursive(n);

        // Update all results at once
        setResults({
            iterative: {
                result: iterativeCalc.result,
                time: iterativeCalc.executionTime,
                steps: n
            },
            formula: {
                result: formulaCalc.result,
                time: formulaCalc.executionTime,
                steps: 1
            },
            recursive: {
                result: recursiveCalc.result,
                time: recursiveCalc.executionTime,
                steps: n
            }
        });

        // Reset progress for all methods
        setProgress({
            iterative: 0,
            formula: 0,
            recursive: 0
        });
    }, [n]);

    const executeMethod = (method: Method) => {
        setSelectedMethod(method);
        setProgress(prev => ({ ...prev, [method]: 0 }));

        // Animate progress
        const duration = method === 'formula' ? 500 : method === 'iterative' ? 1500 : 2000;
        const steps = 60;
        const increment = 100 / steps;
        let current = 0;

        const interval = setInterval(() => {
            current += increment;
            if (current >= 100) {
                setProgress(prev => ({ ...prev, [method]: 100 }));
                clearInterval(interval);
            } else {
                setProgress(prev => ({ ...prev, [method]: current }));
            }
        }, duration / steps);
    };

    const runRaceMode = () => {
        setRaceMode(true);
        setProgress({ iterative: 0, formula: 0, recursive: 0 });

        // Stagger the animations
        setTimeout(() => executeMethod('formula'), 0);
        setTimeout(() => executeMethod('iterative'), 200);
        setTimeout(() => executeMethod('recursive'), 400);

        setTimeout(() => setRaceMode(false), 3000);
    };

    const displayMethod = hoveredMethod || selectedMethod;
    const methodInfo = displayMethod ? METHODS.find(m => m.id === displayMethod) : null;

    const generateSteps = (method: Method, n: number): string[] => {
        if (method === 'iterative') {
            const steps = [];
            let sum = 0;
            for (let i = 1; i <= Math.min(n, 10); i++) {
                sum += i;
                steps.push(`Step ${i}: sum = ${sum - i} + ${i} = ${sum}`);
            }
            if (n > 10) steps.push(`... (${n - 10} more steps)`);
            return steps;
        } else if (method === 'formula') {
            return [
                `Step 1: Apply formula n × (n + 1) / 2`,
                `Step 2: Calculate ${n} × ${n + 1} = ${n * (n + 1)}`,
                `Step 3: Divide by 2 = ${(n * (n + 1)) / 2}`
            ];
        } else {
            const steps = [];
            for (let i = n; i > Math.max(n - 10, 0); i--) {
                steps.push(`sumToN(${i}) = ${i} + sumToN(${i - 1})`);
            }
            if (n > 10) steps.push(`... (${n - 10} more recursive calls)`);
            steps.push(`sumToN(1) = 1 (base case)`);
            return steps;
        }
    };

    const visualizeSum = (n: number): string => {
        if (n <= 10) {
            return Array.from({ length: n }, (_, i) => i + 1).join(' + ') + ` = ${results.formula.result}`;
        }
        return `1 + 2 + 3 + ... + ${n} = ${results.formula.result}`;
    };

    return (
        <div className="h-full overflow-auto bg-gradient-to-br from-terminal-dark via-terminal-darker to-terminal-dark p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto space-y-6"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.h1
                        className="text-4xl font-bold text-gradient"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                    >
                        🧮 Mathematical Methods Lab
                    </motion.h1>
                    <p className="text-terminal-gray-400">
                        Explore three different approaches to calculate the sum from 1 to n
                    </p>
                </div>

                {/* Controls */}
                <motion.div
                    className="terminal-card p-6 space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Slider */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xl font-semibold text-terminal-gray-200">
                                n = <span className="text-4xl text-gradient font-bold">{n}</span>
                            </label>
                            <div className="flex gap-2">
                                {PRESETS.map(preset => (
                                    <button
                                        key={preset}
                                        onClick={() => setN(preset)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200
                      ${n === preset
                                                ? 'bg-gradient-to-r from-cyber-cyan to-cyber-blue text-terminal-dark'
                                                : 'bg-terminal-gray-800 text-terminal-gray-400 hover:bg-terminal-gray-700'
                                            }`}
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <input
                            type="range"
                            min="1"
                            max="1000"
                            value={n}
                            onChange={(e) => setN(parseInt(e.target.value))}
                            className="w-full h-3 rounded-lg appearance-none cursor-pointer
                bg-terminal-gray-800 accent-cyber-cyan
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-6
                [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-gradient-to-r
                [&::-webkit-slider-thumb]:from-cyber-cyan
                [&::-webkit-slider-thumb]:to-cyber-blue
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-cyber-cyan/50
                [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:hover:scale-110"
                        />

                        <div className="flex justify-between text-xs text-terminal-gray-500">
                            <span>1</span>
                            <span>500</span>
                            <span>1000</span>
                        </div>
                    </div>

                    {/* Race Mode Button */}
                    <button
                        onClick={runRaceMode}
                        disabled={raceMode}
                        className="w-full py-4 rounded-lg font-bold text-lg
              bg-gradient-to-r from-purple-500 to-pink-500
              hover:from-purple-600 hover:to-pink-600
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 transform hover:scale-105
              shadow-lg shadow-purple-500/20"
                    >
                        {raceMode ? '🏁 Racing...' : '🚀 Race All Methods'}
                    </button>
                </motion.div>

                {/* Method Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {METHODS.map((method, index) => (
                        <motion.div
                            key={method.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            onHoverStart={() => setHoveredMethod(method.id)}
                            onHoverEnd={() => setHoveredMethod(null)}
                            className={`terminal-card p-6 cursor-pointer transition-all duration-300
                ${selectedMethod === method.id ? 'ring-2 ring-cyber-cyan shadow-lg shadow-cyber-cyan/20' : ''}
                ${hoveredMethod === method.id ? 'scale-105' : ''}`}
                            style={{
                                boxShadow: hoveredMethod === method.id ? `0 0 30px ${method.glowColor}` : undefined
                            }}
                            onClick={() => executeMethod(method.id)}
                        >
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl">{method.icon}</span>
                                        <div>
                                            <h3 className="text-xl font-bold text-terminal-gray-100">
                                                {method.name}
                                            </h3>
                                            <p className="text-xs text-terminal-gray-500">
                                                Click to execute
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-xs text-terminal-gray-500">Time</div>
                                        <div className={`text-2xl font-bold bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}>
                                            {results[method.id].time.toFixed(3)}ms
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-terminal-gray-500">Steps</div>
                                        <div className={`text-2xl font-bold bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}>
                                            {results[method.id].steps}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-terminal-gray-400">
                                        <span>Progress</span>
                                        <span>{progress[method.id].toFixed(0)}%</span>
                                    </div>
                                    <div className="h-3 bg-terminal-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full bg-gradient-to-r ${method.color}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress[method.id]}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>

                                {/* Result */}
                                <div className="pt-4 border-t border-terminal-gray-800">
                                    <div className="text-xs text-terminal-gray-500 mb-1">Result</div>
                                    <div className="text-3xl font-bold text-terminal-gray-100 font-mono">
                                        {results[method.id].result.toLocaleString()}
                                    </div>
                                </div>

                                {/* Complexity */}
                                <div className="flex gap-2 text-xs">
                                    <span className="px-2 py-1 rounded bg-terminal-gray-800 text-cyber-cyan">
                                        Time: {method.timeComplexity}
                                    </span>
                                    <span className="px-2 py-1 rounded bg-terminal-gray-800 text-cyber-purple">
                                        Space: {method.spaceComplexity}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Explanation Panel */}
                <AnimatePresence mode="wait">
                    {methodInfo && (
                        <motion.div
                            key={methodInfo.id}
                            initial={{ opacity: 0, y: 20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="terminal-card p-8 space-y-6"
                        >
                            {/* Title */}
                            <div className="flex items-center gap-4">
                                <span className="text-5xl">{methodInfo.icon}</span>
                                <div>
                                    <h2 className={`text-3xl font-bold bg-gradient-to-r ${methodInfo.color} bg-clip-text text-transparent`}>
                                        {methodInfo.name}
                                    </h2>
                                    <p className="text-terminal-gray-400 mt-1">
                                        {methodInfo.description}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Code */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-terminal-gray-200 flex items-center gap-2">
                                        <span>💻</span> Implementation
                                    </h3>
                                    <pre className="bg-terminal-darker p-4 rounded-lg overflow-x-auto border border-terminal-gray-800">
                                        <code className="text-sm text-terminal-gray-300 font-mono">
                                            {methodInfo.code}
                                        </code>
                                    </pre>
                                </div>

                                {/* Execution Steps */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-terminal-gray-200 flex items-center gap-2">
                                        <span>📝</span> Execution Steps (n = {n})
                                    </h3>
                                    <div className="bg-terminal-darker p-4 rounded-lg border border-terminal-gray-800 max-h-64 overflow-y-auto space-y-2">
                                        {generateSteps(methodInfo.id, n).map((step, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="text-sm text-terminal-gray-400 font-mono"
                                            >
                                                {step}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Visual Representation */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-terminal-gray-200 flex items-center gap-2">
                                    <span>🎨</span> Visual Representation
                                </h3>
                                <div className="bg-terminal-darker p-6 rounded-lg border border-terminal-gray-800">
                                    <div className="text-2xl text-center font-mono text-cyber-cyan">
                                        {visualizeSum(n)}
                                    </div>
                                </div>
                            </div>

                            {/* Complexity Analysis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                                        <span>✅</span> Advantages
                                    </h3>
                                    <ul className="space-y-2">
                                        {methodInfo.pros.map((pro, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-start gap-2 text-terminal-gray-400"
                                            >
                                                <span className="text-green-400 mt-1">•</span>
                                                <span>{pro}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                                        <span>⚠️</span> Disadvantages
                                    </h3>
                                    <ul className="space-y-2">
                                        {methodInfo.cons.map((con, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-start gap-2 text-terminal-gray-400"
                                            >
                                                <span className="text-red-400 mt-1">•</span>
                                                <span>{con}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Complexity Summary */}
                            <div className="bg-gradient-to-r from-terminal-gray-900 to-terminal-gray-800 p-6 rounded-lg border border-terminal-gray-700">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="text-center">
                                        <div className="text-sm text-terminal-gray-500 mb-2">Time Complexity</div>
                                        <div className={`text-4xl font-bold bg-gradient-to-r ${methodInfo.color} bg-clip-text text-transparent`}>
                                            {methodInfo.timeComplexity}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm text-terminal-gray-500 mb-2">Space Complexity</div>
                                        <div className={`text-4xl font-bold bg-gradient-to-r ${methodInfo.color} bg-clip-text text-transparent`}>
                                            {methodInfo.spaceComplexity}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Race Mode Comparison */}
                {raceMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="terminal-card p-8"
                    >
                        <h2 className="text-2xl font-bold text-gradient mb-6 text-center">
                            🏁 Race Comparison
                        </h2>
                        <div className="space-y-4">
                            {METHODS.map(method => (
                                <div key={method.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{method.icon}</span>
                                            <span className="font-semibold text-terminal-gray-200">
                                                {method.name}
                                            </span>
                                        </div>
                                        <span className="text-terminal-gray-400 text-sm">
                                            {results[method.id].time.toFixed(3)}ms
                                        </span>
                                    </div>
                                    <div className="h-8 bg-terminal-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full bg-gradient-to-r ${method.color} flex items-center justify-end pr-3`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress[method.id]}%` }}
                                            transition={{ duration: 0.05 }}
                                        >
                                            {progress[method.id] === 100 && (
                                                <span className="text-white text-sm font-bold">✓</span>
                                            )}
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
