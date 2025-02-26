import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';

const AuthRoutes: React.FC = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
  </Routes>
);

export default AuthRoutes;
