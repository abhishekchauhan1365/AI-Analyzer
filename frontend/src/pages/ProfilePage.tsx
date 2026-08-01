import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Bell, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: 1000 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Account Settings</h1>
        <p className="text-muted" style={{ marginBottom: '40px' }}>
          Manage your account settings and preferences.
        </p>

        <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Sidebar Navigation */}
          <aside style={{ flex: '0 0 240px', width: '100%' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 16px', borderRadius: 'var(--radius-md)',
                      background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                      color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      fontWeight: isActive ? 600 : 500, fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <tab.icon size={18} color={isActive ? 'var(--color-primary-light)' : 'currentColor'} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main style={{ flex: '1 1 0%', minWidth: 300, display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {activeTab === 'general' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                
                {/* Profile Information Card */}
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Avatar</h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>This is your avatar. It is generated automatically from your name.</p>
                  </div>
                  <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: 'var(--gradient-brand)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.8rem', fontWeight: 700, color: '#fff',
                      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                    }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600 }}>{user?.name}</p>
                      <p className="text-muted" style={{ fontSize: '0.85rem' }}>Personal Account</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--color-border)', marginTop: '32px' }}>
                  <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Display Name</h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Please enter your full name, or a display name you are comfortable with.</p>
                  </div>
                  <div style={{ padding: '24px', background: 'rgba(0,0,0,0.01)' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      defaultValue={user?.name || ''} 
                      disabled
                      style={{ maxWidth: 400, opacity: 0.7, cursor: 'not-allowed' }} 
                    />
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} color="var(--color-success)" />
                      Your name is synchronized with your account.
                    </p>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--color-border)', marginTop: '32px' }}>
                  <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Email Address</h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>The email address associated with your account.</p>
                  </div>
                  <div style={{ padding: '24px', background: 'rgba(0,0,0,0.01)' }}>
                    <input 
                      type="email" 
                      className="input-field" 
                      defaultValue={user?.email || ''} 
                      disabled
                      style={{ maxWidth: 400, opacity: 0.7, cursor: 'not-allowed' }} 
                    />
                  </div>
                </div>

                {/* Danger Zone */}
                <div style={{ marginTop: '48px' }}>
                  <h2 style={{ fontSize: '1.25rem', color: 'var(--color-error)', marginBottom: '16px' }}>Danger Zone</h2>
                  <div className="glass-card" style={{ 
                    padding: '24px', 
                    border: '1px solid rgba(239, 68, 68, 0.3)', 
                    background: 'rgba(239, 68, 68, 0.02)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>Log out of all devices</h3>
                      <p className="text-muted" style={{ fontSize: '0.9rem' }}>You will be securely logged out of your current session.</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      style={{
                        padding: '8px 16px', borderRadius: 'var(--radius-md)',
                        background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)',
                        border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer',
                        fontWeight: 600, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', gap: '8px'
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Placeholder Tabs */}
            {activeTab !== 'general' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ textAlign: 'center', padding: '64px 0' }}>
                <Shield size={48} color="var(--color-border)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>This section is under construction</h3>
              </motion.div>
            )}

          </main>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
