import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BrainCircuit, LogOut, LayoutDashboard, History } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Add a sleek scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const NavLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} style={{ textDecoration: 'none', position: 'relative' }}>
        <motion.div
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            color: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
            fontWeight: isActive ? 600 : 500,
            fontSize: '0.9rem',
            background: isActive ? 'var(--color-surface)' : 'transparent',
            boxShadow: isActive ? '0 2px 10px rgba(0,0,0,0.02)' : 'none',
            border: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <Icon size={16} strokeWidth={isActive ? 2.5 : 2} color={isActive ? 'var(--color-brand)' : 'currentColor'} />
          {children}
        </motion.div>
      </Link>
    );
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: 'sticky',
        top: 16,
        zIndex: 100,
        background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(32px) saturate(150%)',
        WebkitBackdropFilter: 'blur(32px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: scrolled 
          ? '0 12px 40px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)' 
          : '0 4px 20px rgba(0, 0, 0, 0.03)',
        borderRadius: 'var(--radius-full)',
        margin: '0 auto',
        maxWidth: 1200,
        width: 'calc(100% - 32px)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 12px 0 24px' }}>
        
        {/* Logo Section */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(79, 70, 229, 0.25)'
          }}>
            <BrainCircuit size={20} color="#fff" />
          </div>
          <span style={{ 
            fontWeight: 800, fontSize: '1.15rem', 
            letterSpacing: '-0.03em', color: 'var(--color-primary)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #4b5563 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AInalyzer
          </span>
        </Link>

        {/* Navigation & Auth Section */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            
            {/* Main Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 16 }}>
              <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink to="/history" icon={History}>History</NavLink>
            </div>

            <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 8px' }} />

            {/* Profile Dropdown / Pill */}
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.02, background: 'var(--color-surface)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '4px 16px 4px 6px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  marginLeft: 4
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--gradient-brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700, color: '#fff',
                  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.2)'
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1.2 }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--color-secondary)', lineHeight: 1 }}>
                    {user?.role === 'admin' ? 'Administrator' : 'Free Plan'}
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05, background: 'rgba(239, 68, 68, 0.12)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              title="Sign Out"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.05)', color: 'var(--color-error)',
                border: 'none', cursor: 'pointer', marginLeft: 8,
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={18} />
            </motion.button>

          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingRight: 12 }}>
            <Link to="/login" style={{ 
              textDecoration: 'none', color: 'var(--color-secondary)', 
              fontWeight: 600, fontSize: '0.95rem',
              transition: 'color 0.2s ease'
            }} className="hover-text-primary">
              Sign In
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  padding: '10px 24px', 
                  borderRadius: 'var(--radius-full)', 
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  background: 'var(--gradient-brand)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Get Started Free
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
