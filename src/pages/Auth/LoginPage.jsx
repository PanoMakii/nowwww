import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import './Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginDemoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemoUser();
    navigate(from, { replace: true });
  };

  return (
    <div>
      <h2 className="auth-form-title">Welcome back</h2>
      <p className="auth-form-subtitle">Sign in to track your meals, macros, and AI plans</p>

      {error && (
        <div className="auth-error-alert" style={{ marginBottom: '16px' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field-group">
          <label className="auth-label" htmlFor="email">Email Address</label>
          <div className="auth-input-wrapper">
            <Mail size={18} className="auth-input-icon" />
            <input
              id="email"
              type="email"
              placeholder="alex@recip52.com"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-field-group">
          <label className="auth-label" htmlFor="password">Password</label>
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="auth-form-row">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A39D93', cursor: 'pointer' }}>
            <input type="checkbox" style={{ accentColor: '#F4C430' }} defaultChecked />
            <span>Remember me</span>
          </label>
          <Link to="/auth/forgot-password" className="auth-forgot-link">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="auth-btn-submit" disabled={loading}>
          <LogIn size={18} />
          <span>{loading ? 'Signing In...' : 'Sign In'}</span>
        </button>
      </form>

      <div className="auth-divider">
        <span>OR QUICK PREVIEW</span>
      </div>

      <button type="button" className="auth-btn-demo" onClick={handleDemoLogin}>
        <Sparkles size={18} />
        <span>Explore with Instant Demo Account</span>
      </button>

      <div className="auth-switch-prompt">
        Don&apos;t have an account yet?
        <Link to="/auth/signup" className="auth-switch-link">
          Create Account
        </Link>
      </div>
    </div>
  );
}
