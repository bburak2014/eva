// src/layouts/MainLayout.tsx
import React from 'react';
import { MainLayoutProps } from '@/shared/types/commonTypes';
import Header from '@/shared/components/common/header/Header';

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen">
            <Header />
            {children}
        </div>
    );
};

export default MainLayout;
