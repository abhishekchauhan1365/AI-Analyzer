import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 20, borderRadius = 4, style }) => {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: 0.8 }}
      transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
      style={{
        width,
        height,
        borderRadius,
        background: 'var(--color-bg-secondary)',
        ...style
      }}
    />
  );
};

export default Skeleton;
