// types  
import { ReactNode } from "react";

export interface ErrorFalBackProps {
    error: Error;
    resetErrorBoundary: () => void;
}
export interface InlineLoadingProps {
    size?: number;
    color?: string;
    className?: string;
}

export interface LoadingSpinnerProps {
    fullScreen?: boolean;
    className?: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastData {
  message: string;
  type?: ToastType;
  duration?: number;
}
export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

export interface ToastContextProps {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
}
export interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}
export interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

export interface MainLayoutProps {
    children: ReactNode;
}
export interface LocalStorageManagerInterface {
    get<T>(key: string): T | null;
    set<T>(key: string, value: T): void;
    remove(key: string): void;
    clear(): void;
}