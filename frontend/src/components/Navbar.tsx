import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BrainCircuit, LayoutDashboard, Clock, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 16,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid var(--color-border)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
      borderRadius: 'var(--radius-xl)',
      margin: '0 auto',
      maxWidth: 1100,
      width: 'calc(100% - 32px)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, padding: '0 20px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <BrainCircuit size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--color-primary)' }}>
            AInalyzer
          </span>
        </Link>

        {/* Nav links */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 2, marginRight: 8 }}>
              <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Dashboard
              </Link>
              <Link to="/history" className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                History
              </Link>
            </div>

            <div style={{ width: 1, height: 20, background: 'var(--color-border)', margin: '0 4px' }} />

            {/* User Profile Pill */}
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '4px 12px 4px 4px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  marginLeft: 8, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--gradient-brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary-light)' }}>
                  {user?.name?.split(' ')[0]}
                </span>
              </motion.div>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.08)', color: 'var(--color-error)',
                border: 'none', cursor: 'pointer', marginLeft: 4,
                transition: 'background 0.2s'
              }}
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/login" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Sign In</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.9rem' }}>Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
