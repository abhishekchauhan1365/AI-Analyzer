import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Analysis } from '../types';
import { FileText, Clock, CheckCircle, XCircle, Loader2, Trash2, ChevronRight } from 'lucide-react';

interface AnalysisCardProps {
  analysis: Analysis;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  completed: { icon: CheckCircle, color: 'var(--color-success)', label: 'Completed', bg: 'var(--color-success-bg)' },
  processing: { icon: Loader2, color: 'var(--color-secondary)', label: 'Analyzing...', bg: 'rgba(6,182,212,0.1)' },
  pending:    { icon: Clock, color: 'var(--color-warning)', label: 'Pending', bg: 'var(--color-warning-bg)' },
  failed:     { icon: XCircle, color: 'var(--color-error)', label: 'Failed', bg: 'var(--color-error-bg)' },
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'var(--color-success)';
  if (score >= 60) return 'var(--color-warning)';
  return 'var(--color-error)';
};

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, onDelete }) => {
  const config = statusConfig[analysis.status];
  const StatusIcon = config.icon;
  const date = new Date(analysis.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="glass-card"
      style={{ padding: '20px 24px', position: 'relative' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* File icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: 'var(--gradient-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--color-border)',
        }}>
          <FileText size={20} color="var(--color-primary-light)" />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {analysis.fileName}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
            {date}
          </p>
        </div>

        {/* Score */}
        {analysis.status === 'completed' && analysis.result && (
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <p style={{
              fontSize: '1.5rem', fontWeight: 800,
              color: getScoreColor(analysis.result.overallScore),
              lineHeight: 1,
            }}>
              {analysis.result.overallScore}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 2 }}>/ 100</p>
          </div>
        )}

        {/* Status badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
          padding: '4px 10px', borderRadius: 'var(--radius-full)',
          background: config.bg,
        }}>
          <StatusIcon size={13} color={config.color}
            style={analysis.status === 'processing' ? { animation: 'spin 1s linear infinite' } : {}} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: config.color }}>{config.label}</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {onDelete && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={(e) => { e.preventDefault(); onDelete(analysis._id); }}
              style={{ padding: '6px 8px', color: 'var(--color-error)' }}
            >
              <Trash2 size={14} />
            </button>
          )}
          {analysis.status === 'completed' && (
            <Link to={`/analysis/${analysis._id}`} className="btn btn-ghost btn-sm" style={{ padding: '6px 8px' }}>
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisCard;
