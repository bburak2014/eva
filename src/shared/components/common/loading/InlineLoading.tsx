// src/components/InlineLoading.tsx
import React from 'react';

interface InlineLoadingProps {
  size?: number;     
  color?: string;     
  className?: string;
}

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
