import { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.resetError);
            }

            return (
                <DefaultErrorFallback error={this.state.error} reset={this.resetError} />
            );
        }

        return this.props.children;
    }
}

interface ErrorFallbackProps {
    error: Error;
    reset: () => void;
}

function DefaultErrorFallback({ error, reset }: ErrorFallbackProps) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-terminal-dark">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="terminal-card max-w-lg w-full p-8 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full 
            bg-gradient-to-br from-red-500/20 to-rose-500/20 
            border-2 border-red-500/50 flex items-center justify-center"
                >
                    <span className="text-4xl">⚠️</span>
                </motion.div>

                <h2 className="text-2xl font-bold text-gradient mb-4">
                    Something went wrong
                </h2>

                <p className="text-terminal-gray-400 mb-6">
                    An unexpected error occurred. Don't worry, your data is safe.
                </p>

                <details className="mb-6 text-left">
                    <summary className="cursor-pointer text-cyber-cyan hover:text-cyber-cyan/80 
            transition-colors mb-2 select-none">
                        View error details
                    </summary>
                    <pre className="text-xs text-terminal-gray-500 bg-terminal-darker 
            p-4 rounded-lg overflow-auto max-h-40 mt-2">
                        {error.message}
                        {'\n\n'}
                        {error.stack}
                    </pre>
                </details>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 rounded-lg font-semibold
              bg-gradient-to-r from-cyber-cyan to-cyber-blue
              hover:from-cyber-cyan/80 hover:to-cyber-blue/80
              transition-all duration-200 transform hover:scale-105
              shadow-lg shadow-cyber-cyan/20"
                    >
                        Try Again
                    </button>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 rounded-lg font-semibold
              bg-terminal-gray-800 hover:bg-terminal-gray-700
              text-terminal-gray-300 hover:text-terminal-gray-100
              transition-all duration-200"
                    >
                        Reload Page
                    </button>
                </div>

                <p className="text-xs text-terminal-gray-600 mt-6">
                    If this problem persists, please contact support
                </p>
            </motion.div>
        </div>
    );
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
    return <DefaultErrorFallback error={error} reset={reset} />;
}
