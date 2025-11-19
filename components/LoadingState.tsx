import React from 'react';

const LoadingState: React.FC<{ status: string }> = ({ status }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">🤼</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold brand-font tracking-wide animate-pulse text-white">
        {status === 'UPLOADING' ? 'ENTERING THE RING...' : 'GENERATING THE SCRIPT...'}
      </h3>
      <p className="text-gray-400 mt-2 font-mono text-sm">
        {status === 'UPLOADING' ? 'Processing video data' : 'SuperReactor AI is watching closely...'}
      </p>
    </div>
  );
};

export default LoadingState;