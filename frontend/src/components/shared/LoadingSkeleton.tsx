import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
    className,
    variant = 'rectangular',
    animation = 'wave'
}: SkeletonProps) {
    const baseClasses = 'bg-gradient-to-r from-terminal-dark via-terminal-gray-800 to-terminal-dark bg-[length:200%_100%]';

    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    const animationVariants = {
        wave: {
            backgroundPosition: ['200% 0', '-200% 0'],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
            },
        },
        pulse: {
            opacity: [0.4, 0.8, 0.4],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
        none: {},
    };

    return (
        <motion.div
            className={cn(
                baseClasses,
                variantClasses[variant],
                className
            )}
            animate={animationVariants[animation]}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="terminal-card p-6 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton variant="circular" className="w-12 h-12" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="terminal-card p-6 space-y-4">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-40" />
            </div>
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        </div>
    );
}
