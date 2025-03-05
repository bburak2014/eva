// src/components/LoadingSpinner.tsx
import React from 'react';
import { LoadingSpinnerProps } from '@/shared/types/commonTypes';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    fullScreen = true,
    className = "",
}) => {
    const containerClass = fullScreen
        ? "absolute inset-0 flex items-center min-h-screen justify-center bg-white z-50"
        : "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";

    return (
        <div className={`${containerClass} ${className}`}>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingSpinner;
