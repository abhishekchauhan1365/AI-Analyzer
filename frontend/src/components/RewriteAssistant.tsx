import React, { useState } from 'react';
import { Sparkles, Loader2, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RewriteAssistantProps {
  originalText: string;
}

const RewriteAssistant: React.FC<RewriteAssistantProps> = ({ originalText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rewrites, setRewrites] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleRewrite = async () => {
    if (isOpen && rewrites.length > 0) {
      setIsOpen(false);
      return;
    }
    
    setIsOpen(true);
    setIsLoading(true);
    try {
      // Call the standalone Microservice
      const res = await fetch(`${import.meta.env.VITE_API_URL.replace('/api', '')}/api/rewrite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ text: originalText })
      });
      
      const data = await res.json();
      if (data.success && data.data.rewrites) {
        setRewrites(data.data.rewrites);
      }
    } catch (error) {
      console.error('Failed to rewrite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ marginTop: 8 }}>
      <button 
        onClick={handleRewrite}
        className="btn btn-sm"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: isOpen ? 'var(--color-bg)' : 'rgba(79, 70, 229, 0.1)',
          color: 'var(--color-brand)',
          border: '1px solid rgba(79, 70, 229, 0.2)',
          fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-full)'
        }}
      >
        <Sparkles size={12} />
        {isOpen ? 'Close Assistant' : 'Rewrite with AI'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginTop: 12 }}
          >
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              boxShadow: 'var(--shadow-sm)'
            }}>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  <Loader2 size={16} className="spin" /> Generating professional alternatives...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>Select an option to copy:</p>
                  {rewrites.map((rw, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
                      padding: 12, background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--color-text-muted)' }}>{rw}</p>
                      <button 
                        onClick={() => handleCopy(rw, i)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: copiedIndex === i ? 'var(--color-success)' : 'var(--color-text-muted)',
                          padding: 4
                        }}
                      >
                        {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default RewriteAssistant;
