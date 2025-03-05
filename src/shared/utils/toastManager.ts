// src/shared/utils/toastManager.ts
export type ToastType = 'success' | 'error' | 'info';
import { ToastData } from "@/shared/types/commonTypes";

type ToastListener = (toast: ToastData) => void;

class ToastManager {
  private listeners: ToastListener[] = [];

  subscribe(listener: ToastListener) {
    this.listeners.push(listener);
  }

  unsubscribe(listener: ToastListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
    const toast: ToastData = { message, type, duration };
    this.listeners.forEach(listener => listener(toast));
  }
}

export const toastManager = new ToastManager();
