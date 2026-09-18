import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { requestPasswordResetApi } from '../../api/auth.js';
import './Auth.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please provide an email address.');
      return;
    }

    setLoading(true);
    try {
      await requestPasswordResetApi(email);
      setSubmitted(true);
    } catch (err) {
      // For UX/demo, still show confirmation state to prevent user enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-form-title">Reset your password</h2>
      <p className="auth-form-subtitle">
        Enter your registered email and we&apos;ll send a password recovery link.
      </p>

      {error && (
        <div className="auth-error-alert" style={{ marginBottom: '16px' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <CheckCircle2 size={48} color="#4F7942" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#ffffff' }}>Check your inbox</h3>
          <p style={{ color: '#A39D93', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '24px' }}>
            We sent a secure password reset link to <strong style={{ color: '#F4C430' }}>{email}</strong>.
            Please check your spam folder if you do not see it within a few minutes.
          </p>
          <Link to="/auth/login" className="auth-btn-submit" style={{ textDecoration: 'none' }}>
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field-group">
            <label className="auth-label" htmlFor="reset-email">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                id="reset-email"
                type="email"
                placeholder="alex@recip52.com"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn-submit" disabled={loading}>
            <span>{loading ? 'Sending link...' : 'Send Reset Link'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      )}

      <div className="auth-switch-prompt">
        Remember your password?
        <Link to="/auth/login" className="auth-switch-link">
          Sign In
        </Link>
      </div>
    </div>
  );
}
