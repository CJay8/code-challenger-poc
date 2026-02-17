import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/helpers';
import type { AppInfo } from '@/types';

interface DockProps {
  apps: AppInfo[];
  onAppClick: (app: AppInfo) => void;
  activeAppIds: string[];
}

export function Dock({ apps, onAppClick, activeAppIds }: DockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dockRef.current) {
        const rect = dockRef.current.getBoundingClientRect();
        if (e.clientY >= rect.top - 150) {
          setMousePosition({ x: e.clientX });
        } else {
          setMousePosition(null);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.div
        ref={dockRef}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'px-6 py-3',
          'rounded-2xl',
          // Terminal OS dark theme with amber/cyan undertones
          'bg-[#0a0e12]/90 backdrop-blur-2xl',
          'border border-[#2a3f4a]/50',
          'shadow-2xl shadow-[#00b8ff]/10',
          'pointer-events-auto'
        )}
      >
        <div className="flex items-end gap-6">
          {apps.map((app, index) => (
            <DockIcon
              key={app.id}
              app={app}
              index={index}
              onClick={() => onAppClick(app)}
              isActive={activeAppIds.includes(app.id)}
              onHover={setHoveredApp}
              isHovered={hoveredApp === app.id}
              mouseX={mousePosition?.x ?? null}
            />
          ))}
        </div>

        {/* Terminal-style reflection line - amber/cyan gradient */}
        <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#ffb86b]/30 to-transparent" />
      </motion.div>
    </div>
  );
}

interface DockIconProps {
  app: AppInfo;
  index: number;
  onClick: () => void;
  isActive: boolean;
  onHover: (id: string | null) => void;
  isHovered: boolean;
  mouseX: number | null;
}

function DockIcon({
  app,
  index,
  onClick,
  isActive,
  onHover,
  isHovered,
  mouseX
}: DockIconProps) {
  const iconRef = useRef<HTMLButtonElement>(null);
  const [iconPosition, setIconPosition] = useState<{ x: number } | null>(null);

  useEffect(() => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setIconPosition({ x: rect.x + rect.width / 2 });
    }
  }, []);

  const getScale = () => {
    if (!mouseX || !iconPosition) return 1;

    const distance = Math.abs(mouseX - iconPosition.x);
    const maxDistance = 200;

    if (distance > maxDistance) return 1;

    const factor = 1 - Math.pow(distance / maxDistance, 1.5);
    return 1 + factor * 0.25;
  };

  const scale = getScale();

  return (
    <motion.div
      className="relative"
      animate={{ scale }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    >
      <motion.button
        ref={iconRef}
        onClick={onClick}
        onHoverStart={() => onHover(app.id)}
        onHoverEnd={() => onHover(null)}
        className="relative block outline-none group"
        whileTap={{ scale: 0.95 }}
      >
        {/* Terminal OS Icon Container - Dark with colored border */}
        <div
          className={cn(
            'w-14 h-14 rounded-xl',
            'flex items-center justify-center',
            // Dark terminal background
            'bg-[#0a0e12]',
            'border-2',
            isActive
              ? 'border-[#ffb86b] shadow-[0_0_15px_-5px_#ffb86b]' // Active: amber glow
              : 'border-[#2a3f4a]',
            'transition-all duration-200',
            'group-hover:border-[#ffb86b]/70',
            'group-hover:shadow-[0_0_20px_-8px_#ffb86b]'
          )}
        >
          {/* Terminal-styled icon with amber/cyan colors */}
          <span className={cn(
            "text-2xl",
            isActive ? "text-[#ffb86b]" : "text-[#8be9fd]",
            "transition-colors duration-200",
            "group-hover:text-[#ffb86b]"
          )}>
            {app.icon}
          </span>
        </div>

        {/* Active indicator - Terminal amber dot */}
        {isActive && (
          <motion.div
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="w-1 h-1 rounded-full bg-[#ffb86b] shadow-[0_0_8px_#ffb86b]" />
          </motion.div>
        )}
      </motion.button>

      {/* Terminal OS Tooltip - Dark with amber text */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute bottom-full left-1/2 mb-3 px-3 py-1.5 rounded-lg whitespace-nowrap z-50"
            style={{
              background: '#0a0e12',
              border: '1px solid #2a3f4a',
              boxShadow: '0 10px 25px -10px #000, 0 0 20px -10px #ffb86b',
            }}
          >
            {/* Terminal amber text */}
            <span className="text-xs font-mono text-[#ffb86b]">{app.name}</span>

            {/* Terminal-style shortcut in cyan */}
            <span className="ml-2 text-[10px] font-mono text-[#8be9fd]">
              ⌘{index + 1}
            </span>

            {/* Tooltip arrow with terminal colors */}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]"
              style={{
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '5px solid #0a0e12',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}