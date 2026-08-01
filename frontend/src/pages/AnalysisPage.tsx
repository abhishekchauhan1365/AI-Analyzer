import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts';
import { useAnalysis } from '../hooks/useAnalysis';
import { useAnalysisStatus } from '../hooks/useAnalysis';
import { useDeleteAnalysis } from '../hooks/useAnalysis';
import ScoreRing from '../components/ScoreRing';
import SkillBadge from '../components/SkillBadge';
import SectionScore from '../components/SectionScore';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, Key, Target, Trash2, BrainCircuit, Clock, Download, Mail } from 'lucide-react';

const CHART_COLORS = ['#18181b', '#3f3f46', '#52525b', '#71717a', '#a1a1aa'];

const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteMutation = useDeleteAnalysis();

  const { data: analysis, isLoading, error } = useAnalysis(id!);

  // Poll while processing
  const { data: statusData } = useAnalysisStatus(
    id!,
    analysis?.status === 'processing' || analysis?.status === 'pending'
  );

  const currentAnalysis = statusData ?? analysis;

  const handleDelete = async () => {
    if (!id || !confirm('Delete this analysis permanently?')) return;
    await deleteMutation.mutateAsync(id);
    navigate('/history');
  };

  const handleShareEmail = () => {
    const res = statusData?.result ?? analysis?.result;
    if (!res) return;
    const subject = encodeURIComponent(`AI Resume Analysis for ${currentAnalysis?.fileName || 'My Resume'}`);
    const body = encodeURIComponent(
      `I just analyzed my resume with AI!\n\n` +
      `Overall Score: ${res.overallScore}/100\n` +
      `ATS Score: ${res.atsScore}/100\n\n` +
      `Executive Summary:\n${res.summary}\n\n` +
      `Top Strengths:\n- ${res.strengths.slice(0, 3).join('\n- ')}\n\n` +
      `Areas to Improve:\n- ${res.weaknesses.slice(0, 2).join('\n- ')}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <LoadingSpinner size={36} />
        <p className="text-muted">Loading analysis...</p>
      </div>
    );
  }

  if (error || !currentAnalysis) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-error)', marginBottom: 16 }}>Analysis not found or access denied.</p>
        <Link to="/history" className="btn btn-secondary">← Back to History</Link>
      </div>
    );
  }

  // Still processing
  if (currentAnalysis.status === 'processing' || currentAnalysis.status === 'pending') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 24 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary-glow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}>
          <BrainCircuit size={36} color="var(--color-primary)" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 8 }}>AI is Analyzing Your Resume</h2>
          <p className="text-muted">Processing {currentAnalysis.fileName}...</p>
          <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: 6 }}>This usually takes 10–30 seconds</p>
        </div>
        <LoadingSpinner size={24} color="var(--color-primary)" />
      </div>
    );
  }

  if (currentAnalysis.status === 'failed') {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <XCircle size={48} color="var(--color-error)" style={{ marginBottom: 16 }} />
        <h2 style={{ marginBottom: 8 }}>Analysis Failed</h2>
        <p className="text-muted" style={{ marginBottom: 24 }}>{currentAnalysis.errorMessage || 'An error occurred during analysis.'}</p>
        <Link to="/dashboard" className="btn btn-primary">Try Again</Link>
      </div>
    );
  }

  const result = currentAnalysis.result!;

  // Radar chart data
  const radarData = [
    { subject: 'Experience', value: result.sections.experience.score },
    { subject: 'Education', value: result.sections.education.score },
    { subject: 'Skills', value: result.sections.skills.score },
    { subject: 'Format', value: result.sections.formatting.score },
    { subject: 'Summary', value: result.sections.summary.score },
  ];

  const sectionsList = Object.values(result.sections);

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 1100 }}>
      {/* Back + Actions */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <Link to="/dashboard" className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary btn-sm" onClick={handleShareEmail} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Mail size={14} /> Share
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} /> Save PDF
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* File info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: 6 }}>{currentAnalysis.fileName}</h1>
        <p className="text-muted" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={14} />
          Analyzed on {new Date(currentAnalysis.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          {result.estimatedYearsExperience > 0 && ` · ~${result.estimatedYearsExperience} years experience`}
        </p>
      </motion.div>

      {/* Score heroes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card"
        style={{ padding: 40, marginBottom: 32, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
      >
        <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          <ScoreRing score={result.overallScore} size={160} label="Overall" />
          <ScoreRing score={result.atsScore} size={130} label="ATS Score" color="#52525b" />
          <div style={{ flex: 1, minWidth: 260 }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 12, fontWeight: 700 }}>AI Executive Summary</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>{result.summary}</p>
            {result.targetRoles.length > 0 && (
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Target size={16} color="var(--color-text-muted)" style={{ marginTop: 3, flexShrink: 0 }} />
                {result.targetRoles.map((role) => (
                  <SkillBadge key={role} skill={role} variant="purple" />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Charts + Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        {/* Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card" style={{ padding: 32 }}
        >
          <h2 style={{ fontSize: '1.1rem', marginBottom: 24, fontWeight: 700 }}>Competency Radar</h2>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontWeight: 600 }} />
              <Radar name="Score" dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary-light)" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card" style={{ padding: 32 }}
        >
          <h2 style={{ fontSize: '1.1rem', marginBottom: 24, fontWeight: 700 }}>Detailed Section Scores</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={radarData} barSize={32} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="subject" tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 12, color: 'var(--color-text)', boxShadow: 'var(--shadow-sm)' }}
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {radarData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Section breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="glass-card" style={{ padding: 28, marginBottom: 28 }}
      >
        <h2 style={{ fontSize: '1rem', marginBottom: 24 }}>Section Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 28 }}>
          {sectionsList.map((s) => <SectionScore key={s.name} {...s} />)}
        </div>
      </motion.div>

      {/* Strengths + Weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card" style={{ padding: 28 }}
        >
          <h2 style={{ fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={18} color="var(--color-success)" /> Strengths
          </h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none' }}>
            {result.strengths.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-success)', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--color-text-muted)' }}>{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card" style={{ padding: 28 }}
        >
          <h2 style={{ fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <XCircle size={18} color="var(--color-warning)" /> Areas to Improve
          </h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none' }}>
            {result.weaknesses.map((w, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-warning)', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>!</span>
                <span style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--color-text-muted)' }}>{w}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card" style={{ padding: 32, marginBottom: 32, border: '1px solid var(--color-border)' }}
      >
        <h2 style={{ fontSize: '1.1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
          <Lightbulb size={20} color="var(--color-text)" /> Strategic AI Recommendations
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {result.suggestions.map((s, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              padding: '16px 20px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{
                minWidth: 28, height: 28, borderRadius: '50%',
                background: 'var(--color-primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>{s}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Skills + Keywords */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass-card" style={{ padding: 28 }}
        >
          <h2 style={{ fontSize: '1rem', marginBottom: 16 }}>Skills Found</h2>
          {result.skillCategories.map(({ category, skills }) => (
            <div key={category} style={{ marginBottom: 16 }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                {category}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skills.map((s) => <SkillBadge key={s} skill={s} variant="purple" />)}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card" style={{ padding: 28 }}
        >
          <h2 style={{ fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Key size={16} color="var(--color-text-muted)" /> ATS Keywords Detected
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {result.keywords.map((k) => <SkillBadge key={k} skill={k} variant="cyan" />)}
          </div>
          <p className="text-muted" style={{ fontSize: '0.78rem', marginTop: 16, lineHeight: 1.6 }}>
            These keywords were found in your resume and help pass ATS filters. Make sure they match the job description.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisPage;
