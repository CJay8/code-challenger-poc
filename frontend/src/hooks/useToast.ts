import { useState, useCallback } from 'react';
import { Toast, ToastType } from '@/components/shared/Toast';
import { generateId } from '@/utils/helpers';

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    duration: number = 5000
  ) => {
    const id = generateId();
    const toast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, toast]);

    // Optional audio feedback
    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
      if (type === 'success') {
        window.navigator.vibrate(50);
      } else if (type === 'error') {
        window.navigator.vibrate([50, 50, 50]);
      }
    }

    return id;
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  return {
    toasts,
    showToast,
    closeToast,
    success,
    error,
    info,
    warning,
  };
}
