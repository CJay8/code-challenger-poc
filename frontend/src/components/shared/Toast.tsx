import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const toastIcons = {
    success: '✓',
    error: '✕',
    info: 'i',
    warning: '⚠',
};

const toastColors = {
    success: 'from-green-500/20 to-emerald-500/20 border-green-500/50',
    error: 'from-red-500/20 to-rose-500/20 border-red-500/50',
    info: 'from-cyber-cyan/20 to-cyber-blue/20 border-cyber-cyan/50',
    warning: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50',
};

const toastIconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-cyber-cyan',
    warning: 'text-yellow-400',
};

function ToastItem({ toast, onClose }: ToastProps) {
    useEffect(() => {
        if (toast.duration) {
            const timer = setTimeout(() => {
                onClose(toast.id);
            }, toast.duration);

            return () => clearTimeout(timer);
        }
    }, [toast.id, toast.duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
        flex items-start gap-3 p-4 rounded-lg border backdrop-blur-xl
        bg-gradient-to-br ${toastColors[toast.type]}
        shadow-lg shadow-black/20 min-w-[300px] max-w-[400px]
      `}
        >
            <div className={`
        flex items-center justify-center w-6 h-6 rounded-full
        bg-terminal-dark/50 ${toastIconColors[toast.type]} font-bold text-sm
      `}>
                {toastIcons[toast.type]}
            </div>

            <div className="flex-1">
                <p className="text-terminal-gray-100 text-sm font-medium leading-relaxed">
                    {toast.message}
                </p>
            </div>

            <button
                onClick={() => onClose(toast.id)}
                className="text-terminal-gray-400 hover:text-terminal-gray-100 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </motion.div>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return createPortal(
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={onClose} />
                ))}
            </AnimatePresence>
        </div>,
        document.body
    );
}
