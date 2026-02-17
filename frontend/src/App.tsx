import { useState, useReducer, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@components/shared/ThemeProvider';
import { StatusBar } from '@components/shared/StatusBar';
import { Dock } from '@components/shared/Dock';
import { WindowManager } from '@components/shared/WindowManager';
import { Launchpad } from '@components/shared/Launchpad';
import { ErrorBoundary } from '@components/shared/ErrorBoundary';
import { ToastContainer } from '@components/shared/Toast';
import { KeyboardShortcutsModal } from '@components/shared/KeyboardShortcuts';
import { useToast } from '@/hooks/useToast';
import { useKeyboardShortcut } from '@components/shared/KeyboardShortcuts';
import { generateId } from '@utils/helpers';
import type { AppInfo, Window, WindowAction } from '@/types';

// Available apps configuration
const APPS: AppInfo[] = [
  {
    id: 'math-lab',
    name: 'Math Lab',
    icon: '🧮',
    description: 'Mathematical Operations',
    color: '#00f0ff',
    component: 'MathLab',
  },
  {
    id: 'currency-swap',
    name: 'Currency Swap',
    icon: '💱',
    description: 'Currency Exchange Form',
    color: '#ffd700',
    component: 'CurrencySwapForm',
  },
  {
    id: 'code-auditor',
    name: 'Code Auditor',
    icon: '🔍',
    description: 'Smart Contract Analysis',
    color: '#00ff9d',
    component: 'CodeAuditor',
  },
];

// Window management reducer
function windowReducer(state: Window[], action: WindowAction): Window[] {
  switch (action.type) {
    case 'OPEN': {
      const existingWindow = state.find(
        (w) => w.component === action.payload.component
      );
      if (existingWindow) {
        return state.map((w) =>
          w.id === existingWindow.id
            ? { ...w, isMinimized: false, isFocused: true, zIndex: Math.max(...state.map((win) => win.zIndex)) + 1 }
            : { ...w, isFocused: false }
        );
      }

      const newWindow: Window = {
        id: generateId(),
        title: action.payload.name,
        icon: action.payload.icon,
        component: action.payload.component,
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        position: { x: 100 + state.length * 30, y: 100 + state.length * 30 },
        size: { width: 800, height: 600 },
        zIndex: Math.max(...state.map((w) => w.zIndex), 0) + 1,
      };

      return [
        ...state.map((w) => ({ ...w, isFocused: false })),
        newWindow,
      ];
    }

    case 'CLOSE':
      return state.filter((w) => w.id !== action.payload);

    case 'MINIMIZE':
      return state.map((w) =>
        w.id === action.payload ? { ...w, isMinimized: true, isFocused: false } : w
      );

    case 'MAXIMIZE':
      return state.map((w) =>
        w.id === action.payload ? { ...w, isMaximized: !w.isMaximized } : w
      );

    case 'FOCUS':
      return state.map((w) =>
        w.id === action.payload
          ? { ...w, isFocused: true, zIndex: Math.max(...state.map((win) => win.zIndex)) + 1 }
          : { ...w, isFocused: false }
      );

    case 'UPDATE_POSITION':
      return state.map((w) =>
        w.id === action.payload.id
          ? { ...w, position: action.payload.position }
          : w
      );

    case 'UPDATE_SIZE':
      return state.map((w) =>
        w.id === action.payload.id
          ? { ...w, size: action.payload.size }
          : w
      );

    default:
      return state;
  }
}

function App() {
  const [windows, dispatch] = useReducer(windowReducer, []);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [networkStatus] = useState({
    chain: 'Ethereum',
    isConnected: true,
  });
  const [walletStatus, setWalletStatus] = useState({
    address: undefined as string | undefined,
    isConnected: false,
  });

  const { toasts, closeToast, success, error } = useToast();

  // Define keyboard shortcuts
  const shortcuts = [
    {
      key: '1',
      meta: true,
      description: 'Open Math Lab',
      callback: () => handleAppClick(APPS[0]),
    },
    {
      key: '2',
      meta: true,
      description: 'Open Swap Terminal',
      callback: () => handleAppClick(APPS[1]),
    },
    {
      key: '3',
      meta: true,
      description: 'Open Code Auditor',
      callback: () => handleAppClick(APPS[2]),
    },
    {
      key: 'F4',
      description: 'Toggle Launchpad',
      callback: () => setIsLaunchpadOpen((prev) => !prev),
    },
    {
      key: '/',
      meta: true,
      shift: true,
      description: 'Show Keyboard Shortcuts',
      callback: () => setIsShortcutsOpen((prev) => !prev),
    },
    {
      key: 'Escape',
      description: 'Close Launchpad',
      callback: () => setIsLaunchpadOpen(false),
    },
  ];

  useKeyboardShortcut(shortcuts);

  const handleAppClick = useCallback((app: AppInfo) => {
    dispatch({ type: 'OPEN', payload: app });
    success(`${app.name} opened`, 2000);
  }, [success]);

  const handleConnectWallet = useCallback(() => {
    if (walletStatus.isConnected) {
      setWalletStatus({ address: undefined, isConnected: false });
      error('Wallet disconnected', 3000);
    } else {
      // Simulate wallet connection
      setWalletStatus({
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        isConnected: true,
      });
      success('Wallet connected successfully', 3000);
    }
  }, [walletStatus.isConnected, success, error]);

  const activeAppIds = windows
    .filter((w) => !w.isMinimized)
    .map((w) => APPS.find((app) => app.component === w.component)?.id)
    .filter(Boolean) as string[];

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="h-screen w-screen overflow-hidden bg-terminal-dark scanlines grid-background">
          {/* Toast Notifications */}
          <ToastContainer toasts={toasts} onClose={closeToast} />

          {/* Keyboard Shortcuts Modal */}
          <KeyboardShortcutsModal
            shortcuts={shortcuts}
            isOpen={isShortcutsOpen}
            onClose={() => setIsShortcutsOpen(false)}
          />

          {/* Status Bar */}
          <StatusBar
            networkStatus={networkStatus}
            walletStatus={walletStatus}
            onConnectWallet={handleConnectWallet}
          />

          {/* Main Desktop Area - Takes full height minus status bar */}
          <div className="h-[calc(100vh-48px)] relative">
            <AnimatePresence>
              <WindowManager
                windows={windows}
                onClose={(id) => dispatch({ type: 'CLOSE', payload: id })}
                onMinimize={(id) => dispatch({ type: 'MINIMIZE', payload: id })}
                onMaximize={(id) => dispatch({ type: 'MAXIMIZE', payload: id })}
                onFocus={(id) => dispatch({ type: 'FOCUS', payload: id })}
                onUpdatePosition={(id, position) =>
                  dispatch({ type: 'UPDATE_POSITION', payload: { id, position } })
                }
              />
            </AnimatePresence>

            {/* Welcome Message when no windows are open */}
            {windows.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <h1 className="text-6xl font-bold text-gradient animate-pulse-glow">
                    Terminal OS
                  </h1>
                  <p className="text-xl text-terminal-gray-400">
                    Click an app from the dock or press{' '}
                    <kbd className="px-3 py-1.5 mx-1 bg-terminal-light rounded font-mono text-cyber-cyan border border-terminal-gray-700">
                      F4
                    </kbd>{' '}
                    to launch
                  </p>
                  <div className="flex gap-4 justify-center text-sm text-terminal-gray-500">
                    <div>
                      <kbd className="px-2 py-1 bg-terminal-light rounded font-mono">⌘</kbd> + <kbd className="px-2 py-1 bg-terminal-light rounded font-mono">1-3</kbd> for quick launch
                    </div>
                    <div>
                      <kbd className="px-2 py-1 bg-terminal-light rounded font-mono">⌘</kbd> + <kbd className="px-2 py-1 bg-terminal-light rounded font-mono">Shift</kbd> + <kbd className="px-2 py-1 bg-terminal-light rounded font-mono">/</kbd> for shortcuts
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dock - Outside any containers, fixed position */}
          <Dock
            apps={APPS}
            onAppClick={handleAppClick}
            activeAppIds={activeAppIds}
          />

          {/* Launchpad */}
          <Launchpad
            isOpen={isLaunchpadOpen}
            apps={APPS}
            onClose={() => setIsLaunchpadOpen(false)}
            onAppClick={handleAppClick}
          />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;