// src/features/auth/routes/authRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import NotFound from '../../../shared/components/NotFound';

export const basePath = "/auth";

const AuthRoutes: React.FC = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/auth/*" element={<NotFound />} />

  </Routes>
);

export default AuthRoutes;
