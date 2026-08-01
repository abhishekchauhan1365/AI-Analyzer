import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Upload, BarChart3, Shield, Zap, CheckCircle, ArrowRight, Star, ChevronDown, Quote, Search, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';

const features = [
  { icon: Upload, title: 'Upload in Seconds', desc: 'Drag & drop your PDF resume. Supports up to 5MB.' },
  { icon: BrainCircuit, title: 'Gemini AI Analysis', desc: 'Powered by Google Gemini for deep, human-like resume review.' },
  { icon: BarChart3, title: 'Detailed Scoring', desc: 'Get scores on experience, skills, formatting, ATS compatibility and more.' },
  { icon: Zap, title: 'Instant Results', desc: 'Full analysis ready in under 30 seconds with actionable suggestions.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and never shared with third parties.' },
  { icon: CheckCircle, title: 'ATS Optimized', desc: 'Find out how well your resume passes applicant tracking systems.' },
];

const stats = [
  { value: '10K+', label: 'Resumes Analyzed' },
  { value: '94%', label: 'User Satisfaction' },
  { value: '30s', label: 'Average Analysis Time' },
  { value: 'Free', label: 'To Get Started' },
];

const testimonials = [
  { quote: "AInalyzer pointed out exactly why my resume was getting rejected by ATS systems. I fixed the formatting and landed three interviews the next week!", author: "Sarah Jenkins", role: "Product Manager" },
  { quote: "The feedback is incredibly specific. It's like having a senior recruiter sitting next to you and reviewing every bullet point.", author: "David Chen", role: "Software Engineer" },
  { quote: "I love how fast and detailed it is. The 'Strengths & Weaknesses' section gave me exactly what I needed to refine my pitch.", author: "Elena Rodriguez", role: "Marketing Director" }
];

const faqs = [
  { q: "Is AInalyzer really free?", a: "Yes! Creating an account and analyzing your resume is completely free. We believe everyone deserves access to top-tier career tools." },
  { q: "Is my resume data safe?", a: "Absolutely. We use industry-standard encryption, and your data is never sold or shared with third parties. We strictly use it to generate your private analysis." },
  { q: "How does the ATS score work?", a: "Our AI evaluates your resume against common Applicant Tracking System parsers, checking for standard formatting, keyword density, and structural readability." },
  { q: "What formats do you support?", a: "Currently, we support standard PDF files up to 5MB. We recommend exporting your resume to PDF from Word or Google Docs to preserve formatting." }
];

const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: 'relative', padding: '100px 0 80px', overflow: 'hidden' }}>
        <div className="glow-orb glow-orb-purple" style={{ width: 500, height: 500, top: -200, left: -100 }} />
        <div className="glow-orb glow-orb-cyan" style={{ width: 400, height: 400, top: -100, right: -150 }} />

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 'var(--radius-full)',
              background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
              fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary-light)', marginBottom: 32,
            }}>
              <Star size={13} fill="currentColor" /> Powered by Google Gemini AI
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
              Get Your Resume{' '}
              <span className="gradient-text">AI-Analyzed</span>
              <br />in 30 Seconds
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--color-text-muted)',
              maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.7,
            }}>
              Upload your PDF resume and get a comprehensive AI analysis — scores, strengths,
              weaknesses, ATS compatibility, and personalized suggestions to land your dream job.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Analyze My Resume <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
            </div>
          </motion.div>

          {/* Hero preview card */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ marginTop: 72, maxWidth: 700, margin: '72px auto 0' }}
          >
            <div className="glass-card" style={{ padding: 32, boxShadow: 'var(--shadow-glow)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 100, height: 100, borderRadius: '50%', border: '6px solid #10b981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(16,185,129,0.3)', position: 'relative',
                  }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>82</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 8 }}>Overall Score</p>
                </div>
                <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[ { label: 'Work Experience', val: 88 }, { label: 'ATS Score', val: 76 }, { label: 'Skills Coverage', val: 82 } ].map(({ label, val }) => (
                    <div key={label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{label}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{val}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['React', 'TypeScript', 'Node.js', 'Leadership', 'AWS', '+8 more'].map((s, i) => (
                  <span key={i} className="badge badge-purple">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '48px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 32 }}>
            {stats.map(({ value, label }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', fontWeight: 800 }} className="gradient-text">{value}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 16 }}>How AInalyzer Works</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto', fontSize: '1rem' }}>Three simple steps to unlock your resume's full potential.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
            {[
              { title: "1. Upload Your Resume", desc: "Drag and drop your PDF resume into our secure portal. We extract the text seamlessly without storing your sensitive documents long-term.", icon: Upload, align: 'right' },
              { title: "2. Deep AI Analysis", desc: "Our advanced Gemini AI goes to work, reading your resume like a senior hiring manager. It cross-references your skills, experience, and formatting against industry standards.", icon: BrainCircuit, align: 'left' },
              { title: "3. Actionable Insights", desc: "Receive a detailed, beautifully formatted dashboard with an overall score, ATS compatibility, top strengths, and specific areas for improvement.", icon: FileText, align: 'right' }
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 40, flexDirection: step.align === 'left' ? 'row-reverse' : 'row' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <div className="glass-card" style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-subtle)' }}>
                    <step.icon size={64} color="var(--color-primary-light)" opacity={0.8} />
                  </div>
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: 12 }}>{step.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', background: 'var(--gradient-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: 16 }}>Everything you need to stand out</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto', fontSize: '1rem' }}>Our AI gives you the same insight as a senior recruiter — in seconds.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }} className="glass-card" style={{ padding: 28, background: 'var(--color-bg)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 16, background: 'var(--gradient-subtle)', border: '1px solid rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color="var(--color-primary-light)" />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>{title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 16 }}>Loved by Job Seekers</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto', fontSize: '1rem' }}>See how AInalyzer is helping people land their dream roles.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="glass-card" style={{ padding: 32 }}>
                <Quote size={28} color="var(--color-primary-light)" style={{ marginBottom: 16, opacity: 0.5 }} />
                <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: 24, fontStyle: 'italic' }}>"{t.quote}"</p>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.author}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: 16 }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card" style={{ padding: '20px 24px', cursor: 'pointer' }} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{faq.q}</h3>
                  <ChevronDown size={20} style={{ transform: activeFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease', color: 'var(--color-text-muted)' }} />
                </div>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <p style={{ marginTop: 16, fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', padding: '64px 32px', borderRadius: 'var(--radius-xl)', background: 'var(--gradient-subtle)', border: '1px solid rgba(124,58,237,0.2)', boxShadow: 'var(--shadow-glow)', position: 'relative', overflow: 'hidden' }}>
            <div className="glow-orb glow-orb-purple" style={{ width: 300, height: 300, top: -100, left: '30%', opacity: 0.15 }} />
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: 16, position: 'relative' }}>Ready to level up your resume?</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 32, position: 'relative' }}>Join thousands of job seekers who've already improved their resumes with AI.</p>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ position: 'relative' }}>Get Started Free <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '64px 0 32px', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 64 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BrainCircuit size={18} color="#fff" />
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>AInalyzer</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>The world's most advanced AI-powered resume analyzer. Land your dream job faster.</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 20 }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li><Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Features</Link></li>
                <li><Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Pricing</Link></li>
                <li><Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>ATS Checker</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 20 }}>Resources</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li><Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Blog</Link></li>
                <li><Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Resume Templates</Link></li>
                <li><Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Career Advice</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 20 }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li><Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Privacy Policy</Link></li>
                <li><Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div style={{ textAlign: 'center', paddingTop: 32, borderTop: '1px solid var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-subtle)', fontSize: '0.85rem' }}>© {new Date().getFullYear()} AInalyzer · Built with Google Gemini</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
