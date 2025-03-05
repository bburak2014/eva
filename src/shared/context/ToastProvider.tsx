// src/context/ToastContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { toastManager, ToastData, ToastType } from '@/shared/utils/toastManager';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextProps {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

let toastId = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const listener = (toast: ToastData) => {
      addToast(toast.message, toast.type, toast.duration);
    };
    toastManager.subscribe(listener);
    return () => {
      toastManager.unsubscribe(listener);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  return ReactDOM.createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>,
    document.body
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const bgColor =
    toast.type === 'success'
      ? 'bg-green-100 text-green-800'
      : toast.type === 'error'
      ? 'bg-red-100 text-red-800'
      : 'bg-blue-100 text-blue-800';

  return (
    <div
      className={`max-w-xs w-full relative px-6 py-3 rounded-lg shadow-lg ${bgColor} transition-all duration-500 ease-in-out ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div className="flex justify-between items-start">
        <span>{toast.message}</span>
        <button onClick={onClose} className="ml-2 text-xl font-bold leading-none">
          &times;
        </button>
      </div>
    </div>
  );
};
