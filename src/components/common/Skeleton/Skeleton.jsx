import './Skeleton.css';

export function Skeleton({ width = '100%', height = '20px', borderRadius = '8px', className = '', style = {} }) {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.04)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <Skeleton height="140px" borderRadius="12px" />
      <Skeleton width="70%" height="24px" />
      <Skeleton width="40%" height="16px" />
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <Skeleton width="60px" height="24px" borderRadius="12px" />
        <Skeleton width="60px" height="24px" borderRadius="12px" />
      </div>
    </div>
  );
}

export default Skeleton;
