import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import type { RegisterCredentials } from '../types';
import { BrainCircuit, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterPage: React.FC = () => {
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredentials & { confirmPassword: string }>();

  const password = watch('password');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      setServerError('');
      await registerUser({ name: data.name, email: data.email, password: data.password });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Centered background glow */}
      <div className="glow-orb glow-orb-purple" style={{ width: 600, height: 600, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-block', margin: '0 auto 16px' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px var(--color-primary-glow)',
            }}>
              <BrainCircuit size={26} color="#fff" />
            </div>
          </Link>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>Create your account</h1>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>Free forever. No credit card needed.</p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: 40, boxShadow: 'var(--shadow-lg)' }}>
          {serverError && (
            <div style={{
              padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 24,
              background: 'var(--color-error-bg)', border: '1px solid rgba(239,68,68,0.2)',
              fontSize: '0.875rem', color: 'var(--color-error)',
            }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Name */}
            <div className="input-group">
              <label className="input-label" htmlFor="reg-name">Full name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
                <input
                  id="reg-name"
                  type="text"
                  className={`input-field ${errors.name ? 'input-error' : ''}`}
                  style={{ paddingLeft: 40 }}
                  placeholder="John Doe"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
                />
              </div>
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            {/* Email */}
            <div className="input-group">
              <label className="input-label" htmlFor="reg-email">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
                <input
                  id="reg-email"
                  type="email"
                  className={`input-field ${errors.email ? 'input-error' : ''}`}
                  style={{ paddingLeft: 40 }}
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                  })}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="input-group">
              <label className="input-label" htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field ${errors.password ? 'input-error' : ''}`}
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                  placeholder="Min. 6 characters"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password.message}</span>}
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label className="input-label" htmlFor="reg-confirm">Confirm password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
                <input
                  id="reg-confirm"
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                  style={{ paddingLeft: 40 }}
                  placeholder="Re-enter password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === password || 'Passwords do not match',
                  })}
                />
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', padding: '13px', fontSize: '0.95rem', marginTop: 8 }}
            >
              {isSubmitting ? (
                <><LoadingSpinner size={18} color="#fff" /> Creating account...</>
              ) : (
                <>Create Account <ArrowRight size={17} /></>
              )}
            </motion.button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }} />

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
