import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// 'src/features' altındaki tüm routes dosyalarını dinamik olarak içeri aktarır.
const routeModules = import.meta.glob('../../features/**/routes/*.tsx', { eager: true });

// Her bir modülün default export'unu (route bileşeni) alıyoruz.
const ModuleRoutes = Object.values(routeModules).map((module: any) => module.default);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <Routes>
        {ModuleRoutes.map((RouteComponent: React.FC, idx: number) => (
          // Her modülün kendi <Routes> yapısı olduğu varsayılıyor.
          // "/*" path'i, her modülün route yapılandırmasını kapsamasını sağlar.
          <Route key={idx} path="/*" element={<RouteComponent />} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
