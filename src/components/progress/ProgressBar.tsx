import React from 'react';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  size = 'md',
  showText = true 
}) => {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="w-full">
      <div className={`bg-[#2A2A2A] rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className="bg-neon rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%`, height: '100%' }}
        />
      </div>
      {showText && (
        <p className="text-sm text-gray-400 mt-1 text-center">
          {Math.round(progress)}% مكتمل
        </p>
      )}
    </div>
  );
};