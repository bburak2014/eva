import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';


const DashboardRoutes: React.FC = () => (
  <Routes>
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardPage />} />
    </Route>
  </Routes>
);
export const basePath = "/dashboard";

export default DashboardRoutes;
