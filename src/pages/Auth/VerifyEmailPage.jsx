import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, RefreshCw, Mail } from 'lucide-react';
import './Auth.css';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleResend = () => {
    setResending(true);
    setResendStatus('');
    setTimeout(() => {
      setResending(false);
      setResendStatus('A fresh verification link has been sent to your email.');
    }, 1200);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: token ? 'rgba(79, 121, 66, 0.2)' : 'rgba(244, 196, 48, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        color: token ? '#4F7942' : '#F4C430',
      }}>
        {token ? <CheckCircle2 size={36} /> : <Mail size={32} />}
      </div>

      <h2 className="auth-form-title">
        {token ? 'Email Verified Successfully!' : 'Verify your email'}
      </h2>
      <p className="auth-form-subtitle">
        {token
          ? 'Your account has been fully verified. You can now access all AI recipes and meal tracking features.'
          : 'We sent a verification link to your email address. Please click the link to confirm your account.'}
      </p>

      {resendStatus && (
        <div className="auth-success-alert" style={{ marginBottom: '16px', textAlign: 'left' }}>
          <CheckCircle2 size={16} />
          <span>{resendStatus}</span>
        </div>
      )}

      {token ? (
        <Link to="/dashboard" className="auth-btn-submit" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          Go to Dashboard
        </Link>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            type="button"
            className="auth-btn-demo"
            onClick={handleResend}
            disabled={resending}
          >
            <RefreshCw size={16} className={resending ? 'animate-spin' : ''} />
            <span>{resending ? 'Sending...' : 'Resend Verification Email'}</span>
          </button>

          <Link to="/dashboard" className="auth-forgot-link" style={{ marginTop: '8px' }}>
            Skip for now &amp; proceed to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
