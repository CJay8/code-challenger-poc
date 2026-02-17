import { useState, useCallback, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
    id: number;
    x: number;
    y: number;
    size: number;
}

export function useRipple() {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const createRipple = useCallback((event: MouseEvent<HTMLElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple: Ripple = {
            id: Date.now(),
            x,
            y,
            size,
        };

        setRipples((prev) => [...prev, ripple]);

        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
        }, 600);
    }, []);

    const RippleContainer = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.span
                        key={ripple.id}
                        className="absolute rounded-full bg-white/20"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: ripple.size,
                            height: ripple.size,
                        }}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );

    return { createRipple, RippleContainer };
}

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function RippleButton({ children, onClick, className, ...props }: RippleButtonProps) {
    const { createRipple, RippleContainer } = useRipple();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        createRipple(e);
        onClick?.(e);
    };

    return (
        <button
            className={`relative overflow-hidden ${className || ''}`}
            onClick={handleClick}
            {...props}
        >
            <RippleContainer />
            {children}
        </button>
    );
}
