import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useUploadAnalysis, useAnalyses, useAnalysisStatus } from '../hooks/useAnalysis';
import { useDeleteAnalysis } from '../hooks/useAnalysis';
import { useQueryClient } from '@tanstack/react-query';
import FileDropzone from '../components/FileDropzone';
import AnalysisCard from '../components/AnalysisCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { BrainCircuit, TrendingUp, FileText, Clock, Sparkles, ArrowRight } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');

  const uploadMutation = useUploadAnalysis();
  const { data: analysesData, isLoading: listLoading } = useAnalyses(1);
  const deleteMutation = useDeleteAnalysis();

  // Poll status of pending analysis
  const { data: statusData } = useAnalysisStatus(
    pendingId ?? '',
    !!pendingId
  );

  const queryClient = useQueryClient();

  // When status completes, clear pending and refresh list
  React.useEffect(() => {
    if (statusData?.status === 'completed' || statusData?.status === 'failed') {
      setPendingId(null);
      setUploadProgress(0);
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
    }
  }, [statusData?.status, queryClient]);

  const handleFile = useCallback(
    async (file: File) => {
      setUploadError('');
      setUploadProgress(0);
      try {
        const result = await uploadMutation.mutateAsync({
          file,
          onProgress: setUploadProgress,
        });
        setPendingId(result._id);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed');
        setUploadProgress(0);
      }
    },
    [uploadMutation]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm('Delete this analysis?')) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const analyses = analysesData?.data ?? [];
  const recentAnalyses = analyses.slice(0, 5);
  const isUploading = uploadMutation.isPending || (!!pendingId && statusData?.status === 'processing');

  // Stats
  const completed = analyses.filter((a) => a.status === 'completed');
  const avgScore = completed.length
    ? Math.round(completed.reduce((acc, a) => acc + (a.result?.overallScore ?? 0), 0) / completed.length)
    : null;
  const bestScore = completed.length
    ? Math.max(...completed.map((a) => a.result?.overallScore ?? 0))
    : null;

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 1100 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 40 }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: 6 }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-muted">Upload a resume to get your AI-powered analysis instantly.</p>
      </motion.div>

      {/* Stats row */}
      {completed.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}
          className="stagger"
        >
          {[
            { icon: FileText, label: 'Analyses Done', value: analyses.length, color: 'var(--color-primary-light)' },
            { icon: TrendingUp, label: 'Average Score', value: avgScore ? `${avgScore}/100` : '—', color: 'var(--color-secondary)' },
            { icon: Sparkles, label: 'Best Score', value: bestScore ? `${bestScore}/100` : '—', color: 'var(--color-success)' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card animate-fade-in-up" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <p style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{value}</p>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: 3 }}>{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Upload section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card"
        style={{ padding: 32, marginBottom: 36, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BrainCircuit size={18} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 2 }}>Analyze a New Resume</h2>
            <p className="text-muted" style={{ fontSize: '0.82rem' }}>PDF only · Max 5MB · Results in ~30s</p>
          </div>
        </div>

        <FileDropzone
          onFile={handleFile}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />

        {uploadError && (
          <p className="error-message" style={{ marginTop: 12, textAlign: 'center' }}>⚠ {uploadError}</p>
        )}

        {/* Processing status */}
        <AnimatePresence>
          {pendingId && statusData?.status === 'processing' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginTop: 16, padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-primary-glow)',
                border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}
            >
              <LoadingSpinner size={18} color="var(--color-primary)" />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  AI is analyzing your resume...
                </p>
                <p className="text-muted" style={{ fontSize: '0.78rem' }}>This typically takes 10–30 seconds</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Recent Analyses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={18} color="var(--color-text-muted)" />
            Recent Analyses
          </h2>
          {analyses.length > 5 && (
            <Link to="/history" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {listLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <LoadingSpinner size={32} />
          </div>
        ) : recentAnalyses.length === 0 ? (
          <div className="glass-card" style={{
            padding: '56px 32px', textAlign: 'center',
            border: '2px dashed var(--color-border)',
          }}>
            <BrainCircuit size={40} color="var(--color-text-subtle)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontWeight: 600, marginBottom: 8 }}>No analyses yet</p>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Upload your first resume above to get started</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="stagger">
            {recentAnalyses.map((analysis) => (
              <div key={analysis._id} className="animate-fade-in-up">
                <AnalysisCard analysis={analysis} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
