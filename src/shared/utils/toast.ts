// src/shared/utils/toast.ts
export function showToast(
    message: string,
    duration: number = 3000,
    type: 'success' | 'error' | 'info' = 'info'
  ) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
      document.body.appendChild(container);
    }
  
    const bgColor =
      type === 'success'
        ? 'bg-green-500'
        : type === 'error'
        ? 'bg-red-500'
        : 'bg-blue-500';
  
    const toast = document.createElement('div');
    toast.className = `max-w-xs px-4 py-2 rounded shadow-lg text-white ${bgColor} opacity-100 transition-opacity duration-500`;
    toast.textContent = message;
  
    container.appendChild(toast);
  
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
        if (container && container.childElementCount === 0) {
          container.remove();
        }
      }, 500);
    }, duration);
  }
  