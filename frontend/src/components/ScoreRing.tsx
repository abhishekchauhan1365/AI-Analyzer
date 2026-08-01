import React, { useEffect, useRef } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 160,
  strokeWidth = 10,
  label = 'Score',
  color,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ringColor = color || getScoreColor(score);

  const svgRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const offset = circumference - (score / 100) * circumference;
      svgRef.current.style.strokeDashoffset = String(offset);
    }
  }, [score, circumference]);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          ref={svgRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
            filter: `drop-shadow(0 0 8px ${ringColor}80)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <span style={{ fontSize: size * 0.22, fontWeight: 800, color: ringColor, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: size * 0.1, color: 'var(--color-text-muted)', fontWeight: 500, textAlign: 'center' }}>
          {label}
        </span>
      </div>
    </div>
  );
};

export default ScoreRing;
