import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NotFound from '@/shared/components/NotFound';

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
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {matchedModules.map(({ Component }, idx) => (
          <Route key={idx} path="/*" element={<Component />} />
        ))}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
