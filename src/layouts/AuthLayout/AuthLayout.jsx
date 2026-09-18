import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout-container">
      <div className="auth-glow-orb-1" />
      <div className="auth-glow-orb-2" />

      <div className="auth-card">
        <div className="auth-brand">
          <Link to="/" className="auth-brand-logo" title="Back to home">
            52
          </Link>
          <h1 className="auth-brand-title">Recip52</h1>
          <p className="auth-brand-subtitle">Smart nutrition &amp; AI-driven wellness</p>
        </div>

        <Outlet />
      </div>

      <Link to="/" className="auth-back-link">
        <ArrowLeft size={16} />
        <span>Return to landing page</span>
      </Link>
    </div>
  );
}
