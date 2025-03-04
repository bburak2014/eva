// main.tsx
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@/global.css';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { ToastProvider } from '@/shared/context/ToastProvider';
import LoadingSpinner from '@/shared/components/common/loading/Loading';
const LazyApp = React.lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
      <Provider store={store}>
        <ToastProvider>
          <Suspense fallback={<LoadingSpinner fullScreen />}>
            <LazyApp />
          </Suspense>
        </ToastProvider>
      </Provider>
    </BrowserRouter>
);
