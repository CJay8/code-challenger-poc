import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    callback: () => void;
    description: string;
}

export function useKeyboardShortcut(shortcuts: KeyboardShortcut[]) {
    const shortcutsRef = useRef(shortcuts);

    useEffect(() => {
        shortcutsRef.current = shortcuts;
    }, [shortcuts]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        shortcutsRef.current.forEach((shortcut) => {
            const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
            const ctrlMatch = !shortcut.ctrl || event.ctrlKey;
            const shiftMatch = !shortcut.shift || event.shiftKey;
            const altMatch = !shortcut.alt || event.altKey;
            const metaMatch = !shortcut.meta || event.metaKey;

            if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
                event.preventDefault();
                shortcut.callback();
            }
        });
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return shortcuts;
}

export function KeyboardHint({ shortcut }: { shortcut: KeyboardShortcut }) {
    const keys = [];
    if (shortcut.ctrl) keys.push('Ctrl');
    if (shortcut.shift) keys.push('Shift');
    if (shortcut.alt) keys.push('Alt');
    if (shortcut.meta) keys.push('⌘');
    keys.push(shortcut.key.toUpperCase());

    return (
        <div className="flex items-center gap-1 text-xs text-terminal-gray-500">
            {keys.map((key, i) => (
                <span key={i}>
                    <kbd className="px-2 py-1 rounded bg-terminal-darker border border-terminal-gray-700 
            font-mono text-terminal-gray-400">
                        {key}
                    </kbd>
                    {i < keys.length - 1 && <span className="mx-1">+</span>}
                </span>
            ))}
        </div>
    );
}

interface KeyboardShortcutsModalProps {
    shortcuts: KeyboardShortcut[];
    isOpen: boolean;
    onClose: () => void;
}

export function KeyboardShortcutsModal({ shortcuts, isOpen, onClose }: KeyboardShortcutsModalProps) {
    useEffect(() => {
        if (isOpen) {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
            onClick={onClose}
        >
            <div
                className="terminal-card max-w-2xl w-full mx-4 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-gradient mb-6">
                    Keyboard Shortcuts
                </h2>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {shortcuts.map((shortcut, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg 
                bg-terminal-darker hover:bg-terminal-gray-800 transition-colors"
                        >
                            <span className="text-terminal-gray-300">{shortcut.description}</span>
                            <KeyboardHint shortcut={shortcut} />
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-terminal-gray-800 text-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-terminal-gray-800 hover:bg-terminal-gray-700 
              text-terminal-gray-300 hover:text-terminal-gray-100 transition-colors"
                    >
                        Close (Esc)
                    </button>
                </div>
            </div>
        </div>
    );
}
