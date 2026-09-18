import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: '#ffffff',
          fontFamily: "'Hanken Grotesk', sans-serif",
          textAlign: 'center',
        }}>
          <div style={{
            background: 'rgba(30, 24, 20, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 99, 71, 0.3)',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '520px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🥑⚠️</div>
            <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: '2rem', color: '#FF6347', marginBottom: '12px' }}>
              Oops, something went wrong
            </h2>
            <p style={{ color: '#C5C5C5', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
              An unexpected error occurred while loading this view. You can return to your dashboard or refresh the application.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                background: 'linear-gradient(135deg, #F4C430 0%, #E5A812 100%)',
                color: '#1A1817',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '999px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Back to Safety (Dashboard)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
