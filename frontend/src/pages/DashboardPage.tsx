import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useSubmitAnalysis, useAnalyses, useAnalysisStatus, useDeleteAnalysis } from '../hooks/useAnalysis';
import { useQueryClient } from '@tanstack/react-query';
import FileDropzone from '../components/FileDropzone';
import AnalysisCard from '../components/AnalysisCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Skeleton from '../components/Skeleton';
import { BrainCircuit, TrendingUp, FileText, Clock, Sparkles, ArrowRight, MessageSquare, Briefcase, FileCode2, GraduationCap } from 'lucide-react';

const ANALYSIS_OPTIONS = ['Resume', 'Sentiment', 'Grammar', 'Readability', 'Summarization', 'Tone', 'Code Review'];

const SAMPLE_INPUTS = [
  { label: 'Resume', icon: Briefcase, text: 'John Doe\nSoftware Engineer\nExperience:\n- Built a React app that scaled to 10k users.\n- Optimized MongoDB queries reducing latency by 40%.' },
  { label: 'Email', icon: MessageSquare, text: 'Hey team, I think we should delay the launch by a week because the new feature is super buggy and I don\'t want to deal with angry customers. Let me know.' },
  { label: 'Code', icon: FileCode2, text: 'function calc(a,b) {\n  return a+b;\n}\n// TODO: add type checks' },
  { label: 'Essay', icon: GraduationCap, text: 'The industrial revolution and its consequences have been a disaster for the human race. They have greatly increased the life expectancy of those of us who live in advanced countries, but they have destabilized society.' }
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  
  const [textInput, setTextInput] = useState('');
  const [analysisType, setAnalysisType] = useState('Resume');
  const [inputType, setInputType] = useState<'text' | 'file'>('text');

  const submitMutation = useSubmitAnalysis();
  const { data: analysesData, isLoading: listLoading } = useAnalyses(1);
  const deleteMutation = useDeleteAnalysis();

  const { data: statusData } = useAnalysisStatus(pendingId ?? '', !!pendingId);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (statusData?.status === 'completed' || statusData?.status === 'failed') {
      setPendingId(null);
      setUploadProgress(0);
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
    }
  }, [statusData?.status, queryClient]);

  const handleSubmitText = async () => {
    if (!textInput.trim()) {
      setUploadError('Please enter some text to analyze.');
      return;
    }
    setUploadError('');
    try {
      const result = await submitMutation.mutateAsync({
        payload: { text: textInput, analysisType }
      });
      setPendingId(result._id);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  const handleFile = useCallback(
    async (file: File) => {
      setUploadError('');
      setUploadProgress(0);
      try {
        const result = await submitMutation.mutateAsync({
          payload: { file, analysisType },
          onProgress: setUploadProgress,
        });
        setPendingId(result._id);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed');
        setUploadProgress(0);
      }
    },
    [submitMutation, analysisType]
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
  const isUploading = submitMutation.isPending || (!!pendingId && statusData?.status === 'processing');

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

      {/* Input section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card"
        style={{ padding: 32, marginBottom: 36, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BrainCircuit size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', marginBottom: 2 }}>Analyze Content</h2>
              <p className="text-muted" style={{ fontSize: '0.82rem' }}>Paste text or upload a document</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select 
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="input-field" 
              style={{ padding: '8px 12px', width: 'auto', minWidth: 160 }}
            >
              {ANALYSIS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt} Analysis</option>)}
            </select>
          </div>
        </div>

        {/* Input Toggle */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--color-bg-secondary)', padding: 4, borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
          <button onClick={() => setInputType('text')} className={`btn btn-sm ${inputType === 'text' ? 'btn-secondary' : 'btn-ghost'}`} style={{ border: inputType === 'text' ? undefined : 'none' }}>Paste Text</button>
          <button onClick={() => setInputType('file')} className={`btn btn-sm ${inputType === 'file' ? 'btn-secondary' : 'btn-ghost'}`} style={{ border: inputType === 'file' ? undefined : 'none' }}>Upload File</button>
        </div>

        {inputType === 'text' ? (
          <div>
            <div style={{ marginBottom: 12, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {SAMPLE_INPUTS.map(sample => (
                <button 
                  key={sample.label} 
                  onClick={() => { setTextInput(sample.text); setAnalysisType(sample.label === 'Email' ? 'Tone' : sample.label === 'Code' ? 'Code Review' : sample.label === 'Essay' ? 'Grammar' : 'Resume'); }}
                  className="btn btn-ghost btn-sm" 
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                >
                  <sample.icon size={14} /> {sample.label}
                </button>
              ))}
            </div>
            <textarea
              className="input-field"
              rows={8}
              placeholder="Paste an email, resume, article, or code snippet here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isUploading}
              style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                {textInput.length} chars · {textInput.split(/\s+/).filter(Boolean).length} words
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" onClick={() => setTextInput('')} disabled={isUploading || !textInput}>Clear</button>
                <button className="btn btn-primary" onClick={handleSubmitText} disabled={isUploading || !textInput.trim()}>
                  {isUploading ? <LoadingSpinner size={16} color="#fff" /> : <Sparkles size={16} />} 
                  Analyze
                </button>
              </div>
            </div>
          </div>
        ) : (
          <FileDropzone
            onFile={handleFile}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        )}

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
                  AI is analyzing your content...
                </p>
                <p className="text-muted" style={{ fontSize: '0.78rem' }}>Generating insights...</p>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
                <Skeleton width={44} height={44} borderRadius={12} />
                <div style={{ flex: 1 }}>
                  <Skeleton width="60%" height={16} style={{ marginBottom: 6 }} />
                  <Skeleton width="30%" height={12} />
                </div>
                <Skeleton width={40} height={30} />
              </div>
            ))}
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
