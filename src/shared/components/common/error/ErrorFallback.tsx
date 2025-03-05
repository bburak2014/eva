// ErrorFallback.tsx
import React from 'react';
 
const ErrorFallback: React.FC<any> = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-red-500 text-2xl">Error: An error occurred.</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 border border-solid border-purple-500 text-purple-500 rounded cursor-pointer hover:bg-purple-500 hover:text-white"
            >
                Retry
            </button>
        </div>
    );
};

export default ErrorFallback;
