import React, { useEffect, useState } from 'react';

interface SectionScoreProps {
  name: string;
  score: number;
  feedback: string;
}

const getColor = (score: number) => {
  if (score >= 80) return 'var(--color-success)';
  if (score >= 60) return 'var(--color-warning)';
  return 'var(--color-error)';
};

const SectionScore: React.FC<SectionScoreProps> = ({ name, score, feedback }) => {
  const [animated, setAnimated] = useState(0);
  const color = getColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{name}</span>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color }}>{score}/100</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{
            width: `${animated}%`,
            background: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{feedback}</p>
    </div>
  );
};

export default SectionScore;
