import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, color = 'var(--color-primary)' }) => (
  <div
    style={{
      width: size,
      height: size,
      border: `2px solid rgba(255,255,255,0.1)`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      flexShrink: 0,
    }}
  />
);

export default LoadingSpinner;
