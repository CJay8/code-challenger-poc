import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/helpers';
import type { AppInfo } from '@/types';

interface LaunchpadProps {
  isOpen: boolean;
  apps: AppInfo[];
  onClose: () => void;
  onAppClick: (app: AppInfo) => void;
}

export function Launchpad({ isOpen, apps, onClose, onAppClick }: LaunchpadProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-terminal-dark bg-opacity-80 backdrop-blur-md z-40"
          />

          {/* Launchpad Grid */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-20"
            onClick={onClose}
          >
            <div
              className="grid grid-cols-4 gap-8 max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {apps.map((app, index) => (
                <motion.button
                  key={app.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    delay: index * 0.05,
                    type: 'spring',
                    damping: 20,
                    stiffness: 300,
                  }}
                  onClick={() => {
                    onAppClick(app);
                    onClose();
                  }}
                  className={cn(
                    'flex flex-col items-center gap-4 p-6 rounded-2xl',
                    'glass-strong border border-terminal-gray-700',
                    'transition-all duration-200',
                    'hover:scale-105 hover:border-cyber-cyan hover:shadow-glow-cyan',
                    'focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:ring-offset-2 focus:ring-offset-terminal-dark',
                    'group'
                  )}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* App Icon */}
                  <motion.div
                    className={cn(
                      'w-24 h-24 rounded-2xl',
                      'flex items-center justify-center',
                      'glass border border-terminal-gray-700',
                      'text-5xl font-bold',
                      'transition-all duration-200',
                      'group-hover:border-opacity-50 group-hover:shadow-glow-cyan'
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${app.color}33, ${app.color}11)`,
                      color: app.color,
                    }}
                  >
                    {app.icon}
                  </motion.div>

                  {/* App Name */}
                  <div className="text-center">
                    <div className="font-medium text-terminal-gray-200 mb-1">
                      {app.name}
                    </div>
                    <div className="text-xs text-terminal-gray-500">
                      {app.description}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ESC hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="glass-strong px-4 py-2 rounded-full text-sm text-terminal-gray-400">
              Press <kbd className="px-2 py-1 mx-1 bg-terminal-light rounded font-mono text-cyber-cyan">ESC</kbd> to close
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
