// src/components/InlineLoading.tsx
import { InlineLoadingProps } from '@/shared/types/commonTypes';
import React from 'react';

const InlineLoading: React.FC<InlineLoadingProps> = ({
  size = 16,
  color = 'text-blue-500',
  className = '',
}) => {
  return (
    <div
      className={`inline-block border-2 border-current border-t-transparent rounded-full animate-spin ${color} ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default InlineLoading;
