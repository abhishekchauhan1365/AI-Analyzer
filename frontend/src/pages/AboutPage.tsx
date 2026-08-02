import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Layers, Zap, ShieldCheck, Code2, Database, Rocket, ArrowRight } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, padding: '80px 24px', maxWidth: 1000 }}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
            fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 24,
          }}>
            <Code2 size={14} /> Open Architecture & Tech Stack
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: 24, lineHeight: 1.1 }}>
            Built for <span className="gradient-text">Performance</span> and Scale
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            AInalyzer is a full-stack, AI-powered document analysis engine designed to evaluate resumes, code, and generic text using Google's Gemini architecture.
          </p>
        </motion.div>

        {/* Tech Stack */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 80 }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: 32, textAlign: 'center' }}>The Technology Stack</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div className="glass-card" style={{ padding: 32 }}>
              <Layers size={32} color="var(--color-primary-light)" style={{ marginBottom: 20 }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Frontend (Vite + React)</h3>
              <p className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                Built with React and Vite for lightning-fast HMR and optimized production builds. 
                State management handled via React Query for seamless data caching and synchronization. 
                Framer Motion powers the micro-interactions.
              </p>
            </div>
            
            <div className="glass-card" style={{ padding: 32 }}>
              <Database size={32} color="var(--color-primary-light)" style={{ marginBottom: 20 }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Backend (Node + Express)</h3>
              <p className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                A robust Express REST API written in TypeScript. Includes JWT-based authentication, 
                Multer for secure in-memory PDF parsing via pdf-parse, and flexible MongoDB schemas 
                using Mongoose to support dynamic analysis results.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 32 }}>
              <Zap size={32} color="var(--color-primary-light)" style={{ marginBottom: 20 }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>AI Engine (Google Gemini)</h3>
              <p className="text-muted" style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                Powered by the Gemini 3.5 Flash Lite model via the official Google GenAI SDK. 
                Features dynamic prompt routing to handle different analysis types (Sentiment, Tone, 
                Grammar, Code Review) with strict JSON schema adherence.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Challenges & Architecture */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
          style={{ padding: '48px 40px', marginBottom: 80, border: '1px solid rgba(124,58,237,0.15)' }}
        >
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <ShieldCheck size={28} color="var(--color-primary)" /> Key Engineering Challenges
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, listStyle: 'none' }}>
                <li>
                  <strong style={{ display: 'block', marginBottom: 4, color: 'var(--color-text)' }}>Dynamic Schema Enforcement</strong>
                  <span className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>Transitioning from a strict "Resume Analyzer" to a general-purpose text engine required pivoting the MongoDB schema to use `Schema.Types.Mixed`, allowing polymorphic result shapes.</span>
                </li>
                <li>
                  <strong style={{ display: 'block', marginBottom: 4, color: 'var(--color-text)' }}>Robust Prompt Engineering</strong>
                  <span className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>Ensuring the AI consistently returned clean JSON required careful prompt design and robust fallback parsing logic to strip accidental markdown fences.</span>
                </li>
                <li>
                  <strong style={{ display: 'block', marginBottom: 4, color: 'var(--color-text)' }}>Decoupled Deployment</strong>
                  <span className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>The frontend and backend are fully decoupled, deploying to separate domains, connected via strictly configured CORS policies and secure HttpOnly cookies/headers.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', padding: '64px 32px', borderRadius: 'var(--radius-xl)', background: 'var(--gradient-subtle)', position: 'relative', overflow: 'hidden' }}
        >
          <Rocket size={48} color="var(--color-primary)" style={{ margin: '0 auto 24px', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>Ready to see it in action?</h2>
          <p className="text-muted" style={{ marginBottom: 32 }}>Test out the generic text analysis or try uploading a PDF resume.</p>
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Go to Dashboard <ArrowRight size={18} />
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default AboutPage;
