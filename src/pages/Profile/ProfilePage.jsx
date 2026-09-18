import { useState } from 'react';
import { User, Shield, Sliders, CheckCircle2, Save, Scale } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import '../Pages.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Alex',
    lastName: user?.lastName || 'Morgan',
    email: user?.email || 'alex@recip52.com',
    dailyCalories: user?.preferences?.dailyCalories || 2150,
    dailyProteinG: user?.preferences?.dailyProteinG || 140,
    dailyCarbsG: user?.preferences?.dailyCarbsG || 210,
    dailyFatG: user?.preferences?.dailyFatG || 65,
    dailyWaterMl: user?.preferences?.dailyWaterMl || 3000,
    unitsSystem: user?.preferences?.unitsSystem || 'metric',
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      preferences: {
        ...user?.preferences,
        dailyCalories: formData.dailyCalories,
        dailyProteinG: formData.dailyProteinG,
        dailyCarbsG: formData.dailyCarbsG,
        dailyFatG: formData.dailyFatG,
        dailyWaterMl: formData.dailyWaterMl,
        unitsSystem: formData.unitsSystem,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile &amp; Settings</h1>
          <p className="page-subtitle">Configure your account details, nutritional targets, and system units</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="auth-success-alert" style={{ marginBottom: '20px' }}>
          <CheckCircle2 size={18} />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Left Column: Avatar & Basic Info */}
          <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'}
              alt="Profile avatar"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #F4C430',
                marginBottom: '16px',
              }}
            />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
              {formData.firstName} {formData.lastName}
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#8E887E', marginBottom: '16px' }}>
              {formData.email}
            </div>

            <span
              style={{
                background: 'rgba(79, 121, 66, 0.2)',
                color: '#7BB661',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              Pro Member (Active)
            </span>
          </div>

          {/* Right Column: Nutrition Targets & Preferences */}
          <div className="panel-card">
            <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Sliders size={20} color="#F4C430" />
              <span>Nutrition Targets &amp; Calibrations</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="auth-label">Daily Calories (kcal)</label>
                <input
                  type="number"
                  className="auth-input"
                  style={{ paddingLeft: '14px', marginTop: '6px' }}
                  value={formData.dailyCalories}
                  onChange={(e) => setFormData({ ...formData, dailyCalories: parseInt(e.target.value, 10) || 0 })}
                />
              </div>

              <div>
                <label className="auth-label">Daily Protein (grams)</label>
                <input
                  type="number"
                  className="auth-input"
                  style={{ paddingLeft: '14px', marginTop: '6px' }}
                  value={formData.dailyProteinG}
                  onChange={(e) => setFormData({ ...formData, dailyProteinG: parseInt(e.target.value, 10) || 0 })}
                />
              </div>

              <div>
                <label className="auth-label">Daily Carbohydrates (grams)</label>
                <input
                  type="number"
                  className="auth-input"
                  style={{ paddingLeft: '14px', marginTop: '6px' }}
                  value={formData.dailyCarbsG}
                  onChange={(e) => setFormData({ ...formData, dailyCarbsG: parseInt(e.target.value, 10) || 0 })}
                />
              </div>

              <div>
                <label className="auth-label">Daily Fats (grams)</label>
                <input
                  type="number"
                  className="auth-input"
                  style={{ paddingLeft: '14px', marginTop: '6px' }}
                  value={formData.dailyFatG}
                  onChange={(e) => setFormData({ ...formData, dailyFatG: parseInt(e.target.value, 10) || 0 })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="auth-label">Measurement System</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  className={`filter-chip ${formData.unitsSystem === 'metric' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, unitsSystem: 'metric' })}
                >
                  Metric (kg / cm / ml)
                </button>
                <button
                  type="button"
                  className={`filter-chip ${formData.unitsSystem === 'imperial' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, unitsSystem: 'imperial' })}
                >
                  Imperial (lbs / in / fl oz)
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
              <Save size={18} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
