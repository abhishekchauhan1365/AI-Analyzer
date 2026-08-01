import React from 'react';

interface SkillBadgeProps {
  skill: string;
  variant?: 'purple' | 'cyan' | 'default';
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, variant = 'default' }) => {
  const styles: Record<string, React.CSSProperties> = {
    purple: { background: 'rgba(124,58,237,0.15)', color: 'var(--color-primary-light)', borderColor: 'rgba(124,58,237,0.25)' },
    cyan:   { background: 'rgba(6,182,212,0.12)', color: 'var(--color-secondary)', borderColor: 'rgba(6,182,212,0.2)' },
    default:{ background: 'var(--color-bg-card)', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.78rem',
        fontWeight: 600,
        border: '1px solid',
        letterSpacing: '0.02em',
        transition: 'all var(--transition-fast)',
        ...styles[variant],
      }}
    >
      {skill}
    </span>
  );
};

export default SkillBadge;
