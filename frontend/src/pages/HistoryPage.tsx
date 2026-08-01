import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnalyses, useDeleteAnalysis } from '../hooks/useAnalysis';
import AnalysisCard from '../components/AnalysisCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Clock, ChevronLeft, ChevronRight, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

const HistoryPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useAnalyses(page);
  const deleteMutation = useDeleteAnalysis();

  const analyses = data?.data ?? [];
  const pagination = data?.pagination;

  const handleDelete = (id: string) => {
    if (confirm('Delete this analysis?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 900 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={24} color="var(--color-primary-light)" />
              Analysis History
            </h1>
            <p className="text-muted" style={{ fontSize: '0.88rem' }}>
              {pagination?.total ?? 0} total {(pagination?.total ?? 0) === 1 ? 'analysis' : 'analyses'}
            </p>
          </div>
          <Link to="/dashboard" className="btn btn-primary btn-sm">+ New Analysis</Link>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <LoadingSpinner size={36} />
        </div>
      ) : analyses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card"
          style={{ padding: '80px 32px', textAlign: 'center', border: '2px dashed var(--color-border)' }}
        >
          <BrainCircuit size={48} color="var(--color-text-subtle)" style={{ margin: '0 auto 20px', display: 'block' }} />
          <h2 style={{ fontSize: '1.2rem', marginBottom: 8 }}>No analyses yet</h2>
          <p className="text-muted" style={{ marginBottom: 24, fontSize: '0.875rem' }}>
            Upload your first resume and get an AI-powered analysis in seconds.
          </p>
          <Link to="/dashboard" className="btn btn-primary">Analyze a Resume</Link>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isFetching ? 0.6 : 1 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            className="stagger"
          >
            {analyses.map((analysis) => (
              <div key={analysis._id} className="animate-fade-in-up">
                <AnalysisCard analysis={analysis} onDelete={handleDelete} />
              </div>
            ))}
          </motion.div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: 12, marginTop: 32,
            }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => p - 1)}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ minWidth: 36, padding: '6px 10px' }}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= pagination.pages || isFetching}
                onClick={() => setPage((p) => p + 1)}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}

          {pagination && (
            <p className="text-muted" style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: 12 }}>
              Page {pagination.page} of {pagination.pages}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;
