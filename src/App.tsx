// src/App.tsx
import React from 'react';
import AppRoutes from '@/app/routes/AppRoutes';
import MainLayout from '@/shared/layouts/MainLayout';

const App: React.FC = () => {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
};

export default App;
