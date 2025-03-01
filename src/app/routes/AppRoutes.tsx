import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NotFound from '@/shared/components/common/error/NotFound';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFalBackComponent from '@/shared/components/common/error/ErrorFalBack';
import LoadingSpinner from '@/shared/components/common/loading/Loading';

type ModuleRoute = {
  Component: React.FC;
  basePath: string;
};

// Eager import of all module route files
const routeModules = import.meta.glob('../../features/**/routes/*.tsx', { eager: true });

// Each module exports default (route component) and basePath
const modules: ModuleRoute[] = Object.values(routeModules).map((mod: any) => ({
  Component: mod.default,
  basePath: mod.basePath,
}));

const AppRoutes: React.FC = () => {
  const location = useLocation();
  // Filter modules that match the current URL
  const matchedModules = modules.filter(({ basePath }) =>
    location.pathname.startsWith(basePath)
  );

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFalBackComponent}
      onReset={() => { }}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {matchedModules.map(({ Component }, idx) => (
            <Route key={idx} path="/*" element={<Component />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
