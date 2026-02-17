import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { cn, formatTime } from '@/utils/helpers';

interface StatusBarProps {
  networkStatus: {
    chain: string;
    isConnected: boolean;
  };
  walletStatus: {
    address?: string;
    isConnected: boolean;
  };
  onConnectWallet: () => void;
}

export function StatusBar({ networkStatus, walletStatus, onConnectWallet }: StatusBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'h-12 px-4 flex items-center justify-between',
        'glass-strong border-b border-terminal-gray-700',
        'z-50'
      )}
    >
      {/* Left section - Logo */}
      <div className="flex items-center gap-3">
        <motion.div
          className="text-xl font-bold text-gradient"
          whileHover={{ scale: 1.05 }}
        >
          Terminal OS
        </motion.div>
        <div className="h-4 w-px bg-terminal-gray-700" />
        <div className="text-xs text-terminal-gray-400">v1.0.0</div>
      </div>

      {/* Center section - Empty (can be used for search or notifications) */}
      <div className="flex-1" />

      {/* Right section - Network, Wallet, Time & Theme */}
      <div className="flex items-center gap-4">
        {/* Network Indicator - Moved to right */}
        <NetworkIndicator
          chain={networkStatus.chain}
          isConnected={networkStatus.isConnected}
        />

        <div className="h-4 w-px bg-terminal-gray-700" />

        <WalletButton
          isConnected={walletStatus.isConnected}
          address={walletStatus.address}
          onClick={onConnectWallet}
        />

        <div className="h-4 w-px bg-terminal-gray-700" />

        <ThemeToggle />

        <div className="h-4 w-px bg-terminal-gray-700" />

        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-cyber-cyan" />
          <span className="font-mono text-sm text-terminal-gray-200">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function NetworkIndicator({ chain, isConnected }: { chain: string; isConnected: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
      <motion.div
        className={cn(
          'w-2 h-2 rounded-full',
          isConnected
            ? 'bg-cyber-green shadow-glow-green'
            : 'bg-cyber-red shadow-glow-red'
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <span className="text-xs font-medium text-terminal-gray-200">
        {isConnected ? chain : 'Disconnected'}
      </span>
    </div>
  );
}

function WalletButton({
  isConnected,
  address,
  onClick,
}: {
  isConnected: boolean;
  address?: string;
  onClick: () => void;
}) {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'px-4 py-1.5 rounded-full font-medium text-sm',
        'transition-all duration-200',
        isConnected
          ? 'glass border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:bg-opacity-10'
          : 'bg-cyber-cyan text-terminal-dark hover:bg-cyber-cyan-light hover:shadow-glow-cyan'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isConnected && address ? (
        <div className="flex items-center gap-2">
          <WalletIcon className="w-4 h-4" />
          <span className="font-mono">{formatAddress(address)}</span>
        </div>
      ) : (
        'Connect Wallet'
      )}
    </motion.button>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  );
}