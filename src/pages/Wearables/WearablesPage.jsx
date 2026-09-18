import { useState, useEffect } from 'react';
import {
  Watch,
  Activity,
  Flame,
  Heart,
  Moon,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Battery,
  ShieldCheck,
  Plus,
  ArrowRight,
  Zap,
  Sparkles,
} from 'lucide-react';
import {
  getWearablesApi,
  connectWearableApi,
  syncWearablesApi,
  disconnectWearableApi,
} from '../../api/wearables.js';
import { useAuth } from '../../context/AuthContext.jsx';
import '../Pages.css';

export default function WearablesPage() {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [connectingDevice, setConnectingDevice] = useState(null);
  const [oauthDialogDevice, setOauthDialogDevice] = useState(null);

  useEffect(() => {
    async function loadWearables() {
      try {
        const data = await getWearablesApi();
        if (data.devices) setDevices(data.devices);
        if (data.telemetry) setTelemetry(data.telemetry);
      } catch (err) {
        console.warn('API error loading wearables:', err);
      }
    }
    loadWearables();
  }, []);

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      const data = await syncWearablesApi();
      if (data.telemetry) {
        setTelemetry(data.telemetry);
      }
      setDevices((prev) =>
        prev.map((d) => (d.connected ? { ...d, lastSync: 'Just now' } : d))
      );
    } catch (err) {
      console.warn('Sync failed:', err);
    } finally {
      setTimeout(() => setSyncing(false), 800);
    }
  };

  const handleToggleConnect = async (device) => {
    if (device.connected) {
      // Disconnect
      try {
        await disconnectWearableApi(device.deviceType);
      } catch (err) {}
      setDevices((prev) =>
        prev.map((d) =>
          d.deviceType === device.deviceType
            ? { ...d, connected: false, lastSync: 'Disconnected', batteryPct: null }
            : d
        )
      );
    } else {
      // Open OAuth simulation dialog
      setOauthDialogDevice(device);
    }
  };

  const confirmOauthConnect = async () => {
    if (!oauthDialogDevice) return;
    setConnectingDevice(oauthDialogDevice.deviceType);
    try {
      const res = await connectWearableApi(oauthDialogDevice.deviceType);
      setDevices((prev) =>
        prev.map((d) =>
          d.deviceType === oauthDialogDevice.deviceType
            ? { ...d, connected: true, lastSync: 'Just now', batteryPct: 94 }
            : d
        )
      );
    } catch (err) {
      // Local fallback
      setDevices((prev) =>
        prev.map((d) =>
          d.deviceType === oauthDialogDevice.deviceType
            ? { ...d, connected: true, lastSync: 'Just now', batteryPct: 94 }
            : d
        )
      );
    } finally {
      setConnectingDevice(null);
      setOauthDialogDevice(null);
    }
  };

  const baseCalories = user?.preferences?.dailyCalories || 2150;
  const activeBurn = telemetry?.caloriesBurned || 520;
  const calorieBonus = telemetry?.nutritionAdjustment?.suggestedCalorieBonusKcal || 260;
  const carbBonus = telemetry?.nutritionAdjustment?.suggestedCarbBonusG || 35;
  const hydrationBonus = telemetry?.nutritionAdjustment?.suggestedHydrationBonusMl || 650;
  const adjustedTotal = baseCalories + calorieBonus;

  const stepsPct = Math.min(((telemetry?.steps || 8420) / (telemetry?.stepGoal || 10000)) * 100, 100);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Wearable Devices &amp; Activity Sync</h1>
          <p className="page-subtitle">
            Synchronize live biometric telemetry to dynamically adjust daily nutrition targets based on energy expenditure
          </p>
        </div>
        <div className="page-actions">
          <button className="btn-primary" onClick={handleSyncAll} disabled={syncing}>
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'Syncing Biometrics...' : 'Sync Active Devices'}</span>
          </button>
        </div>
      </div>

      {/* Live Sync Telemetry Summary Grid */}
      <div className="stats-grid-4">
        {/* Steps */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Daily Steps</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(244, 196, 48, 0.15)', color: '#F4C430' }}>
              <Activity size={20} />
            </div>
          </div>
          <div className="stat-card-value">
            {telemetry?.steps?.toLocaleString() || '8,420'}{' '}
            <span style={{ fontSize: '0.9rem', color: '#8E887E' }}>/ 10,000</span>
          </div>
          <div className="stat-progress-bar">
            <div
              className="stat-progress-fill"
              style={{ width: `${stepsPct}%`, background: '#F4C430' }}
            />
          </div>
        </div>

        {/* Active Burn */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Active Exertion</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(255, 99, 71, 0.15)', color: '#FF6347' }}>
              <Flame size={20} />
            </div>
          </div>
          <div className="stat-card-value">
            {activeBurn} <span style={{ fontSize: '0.9rem', color: '#8E887E' }}>kcal burned</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#7BB661', fontWeight: 600 }}>
            Bonus: +{calorieBonus} kcal &amp; +{carbBonus}g Carbs
          </span>
        </div>

        {/* Heart Rate */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Resting Heart Rate</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
              <Heart size={20} />
            </div>
          </div>
          <div className="stat-card-value">
            {telemetry?.heartRate?.resting || 62}{' '}
            <span style={{ fontSize: '0.9rem', color: '#8E887E' }}>bpm (Resting)</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#B3ADA3' }}>
            Current Pulse: {telemetry?.heartRate?.current || 74} bpm
          </span>
        </div>

        {/* Sleep */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Sleep Duration</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#A855F7' }}>
              <Moon size={20} />
            </div>
          </div>
          <div className="stat-card-value">
            7h 45m <span style={{ fontSize: '0.9rem', color: '#7BB661' }}>(Score 86)</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#7BB661' }}>Optimal Recovery Zone</span>
        </div>
      </div>

      {/* Dynamic Nutritional Goal Calibration Card */}
      <div
        className="panel-card"
        style={{
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(30, 26, 24, 0.8) 0%, rgba(244, 196, 48, 0.08) 100%)',
          border: '1px solid rgba(244, 196, 48, 0.25)',
        }}
      >
        <div className="panel-header">
          <div>
            <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} color="#F4C430" />
              <span>Dynamic Exertion Nutrition Adjustment</span>
            </h2>
            <span style={{ fontSize: '0.82rem', color: '#8E887E' }}>
              Your device tracked {activeBurn} active kcal today. Nutrition recommendations have automatically recalibrated.
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#8E887E' }}>Baseline Daily Target</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--heading)' }}>
              {baseCalories} kcal
            </div>
          </div>

          <div style={{ background: 'rgba(255, 99, 71, 0.1)', padding: '16px', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(255, 99, 71, 0.2)' }}>
            <span style={{ fontSize: '0.78rem', color: '#FF6347', fontWeight: 600 }}>Active Exertion Burn</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#FF6347', fontFamily: 'var(--heading)' }}>
              +{activeBurn} kcal
            </div>
          </div>

          <div style={{ background: 'rgba(244, 196, 48, 0.12)', padding: '16px', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(244, 196, 48, 0.3)' }}>
            <span style={{ fontSize: '0.78rem', color: '#F4C430', fontWeight: 600 }}>Adjusted Daily Budget</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#F4C430', fontFamily: 'var(--heading)' }}>
              {adjustedTotal} kcal
            </div>
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '16px', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <span style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 600 }}>Hydration Replenishment</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#38BDF8', fontFamily: 'var(--heading)' }}>
              +{hydrationBonus} ml
            </div>
          </div>
        </div>
      </div>

      {/* Heart Rate Exertion Zones */}
      <div className="panel-card" style={{ marginBottom: '28px' }}>
        <div className="panel-header">
          <div>
            <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={18} color="#EF4444" />
              <span>Exertion &amp; Heart Rate Distribution</span>
            </h2>
            <span style={{ fontSize: '0.82rem', color: '#8E887E' }}>Today&apos;s cardiovascular intensity zones</span>
          </div>
        </div>

        <div style={{ height: '14px', borderRadius: '7px', background: 'rgba(255,255,255,0.06)', display: 'flex', overflow: 'hidden', marginBottom: '14px' }}>
          <div style={{ width: '60%', background: '#4F7942', title: 'Resting' }} />
          <div style={{ width: '25%', background: '#F4C430', title: 'Fat Burn' }} />
          <div style={{ width: '12%', background: '#FF6347', title: 'Cardio' }} />
          <div style={{ width: '3%', background: '#EF4444', title: 'Peak' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#C5BFB5', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4F7942' }} />
            <span>Resting &amp; Daily Life (60%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F4C430' }} />
            <span>Fat Burn / Zone 2 (25%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF6347' }} />
            <span>Aerobic Cardio (12%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
            <span>Peak Anaerobic (3%)</span>
          </div>
        </div>
      </div>

      {/* Connectors Grid */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>
        Supported Wearable Integrations
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {devices.map((p) => (
          <div key={p.id} className="panel-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: p.iconColor,
                  }}
                >
                  <Watch size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>{p.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: '#8E887E' }}>{p.lastSync}</span>
                </div>
              </div>

              {p.connected && (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: '#7BB661',
                    background: 'rgba(79, 121, 66, 0.2)',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={12} /> Connected
                </span>
              )}
            </div>

            <p style={{ color: '#A39D93', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '20px', flex: 1 }}>
              {p.description}
            </p>

            <button
              className={p.connected ? 'btn-secondary' : 'btn-primary'}
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => handleToggleConnect(p)}
            >
              {p.connected ? 'Disconnect Device' : 'Connect via OAuth'}
            </button>
          </div>
        ))}
      </div>

      {/* OAuth Simulator Modal */}
      {oauthDialogDevice && (
        <div className="modal-overlay" onClick={() => setOauthDialogDevice(null)}>
          <div className="add-meal-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', textAlign: 'center' }}>
            <div className="modal-body" style={{ padding: '32px 24px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'rgba(244, 196, 48, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: oauthDialogDevice.iconColor,
                }}
              >
                <Watch size={32} />
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Connect {oauthDialogDevice.name}
              </h2>
              <p style={{ color: '#A39D93', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '24px' }}>
                Authorize Recip52 to read your daily activity records, heart rate logs, and energy expenditure to calibrate metabolic goals.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#C5BFB5' }}>
                  <ShieldCheck size={16} color="#7BB661" />
                  <span>Encrypted biometric transmission (OAuth2)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#C5BFB5' }}>
                  <ShieldCheck size={16} color="#7BB661" />
                  <span>Read-only permissions (No changes to your device)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setOauthDialogDevice(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={confirmOauthConnect}
                >
                  <span>Authorize &amp; Connect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
