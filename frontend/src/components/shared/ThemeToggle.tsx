import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { cn } from '@/utils/helpers';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative w-16 h-8 rounded-full p-1',
        'bg-terminal-light border border-terminal-gray-700',
        'transition-all duration-300 hover:border-cyber-cyan',
        'focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:ring-offset-2 focus:ring-offset-terminal-dark'
      )}
      aria-label="Toggle theme"
    >
      <motion.div
        className={cn(
          'w-6 h-6 rounded-full',
          'flex items-center justify-center',
          'shadow-lg',
          theme === 'dark'
            ? 'bg-cyber-cyan shadow-glow-cyan'
            : 'bg-cyber-magenta shadow-glow-magenta'
        )}
        layout
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 30,
        }}
        style={{
          x: theme === 'dark' ? 0 : 32,
        }}
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-terminal-dark" />
        ) : (
          <Sun className="w-4 h-4 text-white" />
        )}
      </motion.div>
    </button>
  );
}

function Moon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  );
}

function Sun({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clipRule="evenodd"
      />
    </svg>
  );
}
