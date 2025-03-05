// src/layouts/MainLayout.tsx
import React from 'react';
import { MainLayoutProps } from '@/shared/types/commonTypes';

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
};

export default MainLayout;
