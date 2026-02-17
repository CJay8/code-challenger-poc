import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'spinner' | 'dots' | 'pulse';
}

export function LoadingSpinner({ size = 'md', variant = 'spinner' }: LoadingSpinnerProps) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    if (variant === 'dots') {
        return <DotsLoader size={size} />;
    }

    if (variant === 'pulse') {
        return <PulseLoader size={size} />;
    }

    return (
        <motion.div
            className={`${sizes[size]} border-2 border-terminal-gray-700 border-t-cyber-cyan rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
    );
}

function DotsLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
    const dotSizes = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2.5 h-2.5',
        lg: 'w-3.5 h-3.5',
    };

    return (
        <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className={`${dotSizes[size]} rounded-full bg-cyber-cyan`}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                    }}
                />
            ))}
        </div>
    );
}

function PulseLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className="relative flex items-center justify-center">
            <motion.div
                className={`${sizes[size]} rounded-full bg-cyber-cyan/20 absolute`}
                animate={{
                    scale: [1, 2, 1],
                    opacity: [0.5, 0, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className={`${sizes[size]} rounded-full bg-cyber-cyan/40 absolute`}
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                }}
            />
            <motion.div
                className="w-3 h-3 rounded-full bg-cyber-cyan"
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    );
}

export function FullPageLoader() {
    return (
        <div className="fixed inset-0 bg-terminal-dark/90 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <LoadingSpinner size="lg" variant="pulse" />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-terminal-gray-400"
                >
                    Loading...
                </motion.p>
            </motion.div>
        </div>
    );
}
