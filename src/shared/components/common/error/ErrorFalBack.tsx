// ErrorFalBackComponent.tsx
import React from 'react';

interface ErrorFalBackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const ErrorFalBackComponent: React.FC<ErrorFalBackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div role="alert" className="p-4 bg-red-200 text-red-800 rounded">
            <p>Bir hata oluştu:</p>
            <pre>{error.message}</pre>
            <button
                onClick={resetErrorBoundary}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded">
                Tekrar dene
            </button>
        </div>
    );
};

export default ErrorFalBackComponent;
