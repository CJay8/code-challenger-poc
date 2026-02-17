import { motion, useDragControls, PanInfo } from 'framer-motion';
import { useRef, useState } from 'react';
import { cn } from '@/utils/helpers';
import type { Window as WindowType } from '@/types';
import { MathLab } from '@/components/problem1';
import { CurrencySwapForm } from '@/components/problem2';
import { CodeAuditor } from '@/components/problem3';

interface WindowManagerProps {
  windows: WindowType[];
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
}

export function WindowManager({
  windows,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
}: WindowManagerProps) {
  return (
    <>
      {windows
        .filter((w) => !w.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => (
          <WindowFrame
            key={window.id}
            window={window}
            onClose={() => onClose(window.id)}
            onMinimize={() => onMinimize(window.id)}
            onMaximize={() => onMaximize(window.id)}
            onFocus={() => onFocus(window.id)}
            onUpdatePosition={(pos) => onUpdatePosition(window.id, pos)}
          />
        ))}
    </>
  );
}

interface WindowFrameProps {
  window: WindowType;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUpdatePosition: (position: { x: number; y: number }) => void;
}

function WindowFrame({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
}: WindowFrameProps) {
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDragging(false);
    onUpdatePosition({
      x: window.position.x + info.offset.x,
      y: window.position.y + info.offset.y,
    });
  };

  return (
    <motion.div
      ref={constraintsRef}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: window.isMaximized ? 1 : 1,
        opacity: 1,
        x: window.isMaximized ? 0 : window.position.x,
        y: window.isMaximized ? 0 : window.position.y,
        width: window.isMaximized ? '100vw' : window.size.width,
        height: window.isMaximized ? 'calc(100vh - 48px - 88px)' : window.size.height,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      drag={!window.isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onClick={onFocus}
      className={cn(
        'fixed rounded-xl overflow-hidden',
        'terminal-window',
        window.isFocused && 'shadow-glow-cyan-lg',
        isDragging && 'cursor-grabbing'
      )}
      style={{
        zIndex: window.zIndex,
        top: window.isMaximized ? 48 : undefined,
        left: window.isMaximized ? 0 : undefined,
      }}
    >
      {/* Window Header */}
      <div
        className={cn(
          'terminal-header cursor-grab active:cursor-grabbing select-none',
          window.isFocused && 'border-b-cyber-cyan border-opacity-50'
        )}
        onPointerDown={(e) => {
          if (!window.isMaximized) {
            dragControls.start(e);
          }
        }}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="text-lg">{window.icon}</div>
          <span className="text-sm font-medium text-terminal-gray-200">
            {window.title}
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-2">
          <WindowButton
            color="green"
            onClick={onMinimize}
            icon={<MinimizeIcon />}
          />
          <WindowButton
            color="yellow"
            onClick={onMaximize}
            icon={window.isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
          />
          <WindowButton color="red" onClick={onClose} icon={<CloseIcon />} />
        </div>
      </div>

      {/* Window Content */}
      <div className="terminal-content h-[calc(100%-40px)] overflow-hidden">
        {renderWindowContent(window.component)}
      </div>
    </motion.div>
  );
}

// Component renderer
function renderWindowContent(componentName: string) {
  switch (componentName) {
    case 'MathLab':
      return <MathLab />;
    case 'CurrencySwapForm':
      return <CurrencySwapForm />;
    case 'CodeAuditor':
      return <CodeAuditor />;
    default:
      return (
        <div className="text-center py-20 text-terminal-gray-400">
          <div className="text-6xl mb-4">🚧</div>
          <div className="text-xl font-bold text-gradient mb-2">
            {componentName}
          </div>
          <div className="text-sm text-terminal-gray-500">
            Component coming soon...
          </div>
        </div>
      );
  }
}

interface WindowButtonProps {
  color: 'red' | 'yellow' | 'green';
  onClick: () => void;
  icon: React.ReactNode;
}

function WindowButton({ color, onClick, icon }: WindowButtonProps) {
  const colors = {
    red: 'bg-cyber-red hover:bg-cyber-red-light',
    yellow: 'bg-cyber-yellow hover:bg-cyber-yellow-light',
    green: 'bg-cyber-green hover:bg-cyber-green-light',
  };

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'w-3 h-3 rounded-full',
        colors[color],
        'flex items-center justify-center',
        'transition-all duration-200',
        'group'
      )}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-terminal-dark text-[8px]">
        {icon}
      </span>
    </motion.button>
  );
}

function CloseIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
      <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
      <path d="M1 4h6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <rect
        x="1"
        y="1"
        width="6"
        height="6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <rect
        x="2"
        y="2"
        width="4"
        height="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
