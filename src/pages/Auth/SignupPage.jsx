import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import './Auth.css';

const DIETARY_OPTIONS = [
  'Balanced',
  'High-Protein',
  'Low-Carb',
  'Keto',
  'Vegetarian',
  'Vegan',
  'Mediterranean',
  'Paleo',
  'Pescatarian',
];

const ALLERGY_OPTIONS = [
  'Gluten',
  'Dairy',
  'Peanuts',
  'Tree Nuts',
  'Shellfish',
  'Eggs',
  'Soy',
  'Sesame',
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dietaryRestrictions: ['Balanced'],
    allergies: [],
    dailyCalories: 2000,
    dailyProteinG: 130,
    healthGoal: 'maintain', // lose, maintain, gain_muscle
  });

  const [showPassword, setShowPassword] = useState(false);

  const toggleDietary = (item) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(item)
        ? prev.dietaryRestrictions.filter((i) => i !== item)
        : [...prev.dietaryRestrictions, item],
    }));
  };

  const toggleAllergy = (item) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(item)
        ? prev.allergies.filter((i) => i !== item)
        : [...prev.allergies, item],
    }));
  };

  const handleNextStep = (e) => {
    e?.preventDefault();
    setError('');

    if (step === 1) {
      if (!formData.firstName || !formData.email || !formData.password) {
        setError('Please complete all required fields.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCompleteSignup = async () => {
    setError('');
    setLoading(true);
    try {
      await signup(formData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Onboarding Step Indicators */}
      <div className="onboarding-steps">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`onboarding-step-dot ${step === s ? 'active' : step > s ? 'completed' : ''}`}
          />
        ))}
      </div>

      {error && (
        <div className="auth-error-alert" style={{ marginBottom: '16px' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Account Info */}
      {step === 1 && (
        <form onSubmit={handleNextStep}>
          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-subtitle">Step 1 of 4: Personal Credentials</p>

          <div className="auth-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="auth-field-group">
                <label className="auth-label">First Name</label>
                <div className="auth-input-wrapper">
                  <User size={18} className="auth-input-icon" />
                  <input
                    type="text"
                    placeholder="Alex"
                    className="auth-input"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-label">Last Name</label>
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    placeholder="Morgan"
                    className="auth-input"
                    style={{ paddingLeft: '14px' }}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  type="email"
                  placeholder="alex@recip52.com"
                  className="auth-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Create Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  className="auth-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn-submit">
              <span>Next: Dietary Preferences</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Dietary Preferences */}
      {step === 2 && (
        <div>
          <h2 className="auth-form-title">Dietary Preferences</h2>
          <p className="auth-form-subtitle">Step 2 of 4: What style of eating do you prefer?</p>

          <div className="chips-grid">
            {DIETARY_OPTIONS.map((item) => {
              const selected = formData.dietaryRestrictions.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`filter-chip ${selected ? 'selected' : ''}`}
                  onClick={() => toggleDietary(item)}
                >
                  {selected && <Check size={14} style={{ display: 'inline', marginRight: '4px' }} />}
                  {item}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              className="auth-btn-demo"
              style={{ flex: 1 }}
              onClick={handlePrevStep}
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <button
              type="button"
              className="auth-btn-submit"
              style={{ flex: 2, marginTop: 0 }}
              onClick={handleNextStep}
            >
              <span>Next: Allergies</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Allergies & Intolerances */}
      {step === 3 && (
        <div>
          <h2 className="auth-form-title">Allergies &amp; Intolerances</h2>
          <p className="auth-form-subtitle">Step 3 of 4: What should AI recipes filter out?</p>

          <div className="chips-grid">
            {ALLERGY_OPTIONS.map((item) => {
              const selected = formData.allergies.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`filter-chip ${selected ? 'selected' : ''}`}
                  onClick={() => toggleAllergy(item)}
                >
                  {selected && <Check size={14} style={{ display: 'inline', marginRight: '4px' }} />}
                  {item}
                </button>
              );
            })}
          </div>

          <p style={{ fontSize: '0.8rem', color: '#8C867E', marginTop: '12px' }}>
            No allergies? You can skip this step or adjust anytime in profile settings.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              className="auth-btn-demo"
              style={{ flex: 1 }}
              onClick={handlePrevStep}
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <button
              type="button"
              className="auth-btn-submit"
              style={{ flex: 2, marginTop: 0 }}
              onClick={handleNextStep}
            >
              <span>Next: Goals</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Health Targets */}
      {step === 4 && (
        <div>
          <h2 className="auth-form-title">Daily Nutrition Targets</h2>
          <p className="auth-form-subtitle">Step 4 of 4: Calibrate your daily dashboard targets</p>

          <div className="auth-form">
            <div className="auth-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="auth-label">Daily Calories Target</span>
                <strong style={{ color: '#F4C430' }}>{formData.dailyCalories} kcal</strong>
              </div>
              <input
                type="range"
                min="1200"
                max="4000"
                step="50"
                value={formData.dailyCalories}
                onChange={(e) => setFormData({ ...formData, dailyCalories: parseInt(e.target.value, 10) })}
                style={{ accentColor: '#F4C430', width: '100%', cursor: 'pointer' }}
              />
            </div>

            <div className="auth-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="auth-label">Daily Protein Goal</span>
                <strong style={{ color: '#FF6347' }}>{formData.dailyProteinG} g</strong>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="5"
                value={formData.dailyProteinG}
                onChange={(e) => setFormData({ ...formData, dailyProteinG: parseInt(e.target.value, 10) })}
                style={{ accentColor: '#FF6347', width: '100%', cursor: 'pointer' }}
              />
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Primary Fitness Goal</label>
              <select
                className="auth-input"
                style={{ paddingLeft: '14px', background: '#25211E' }}
                value={formData.healthGoal}
                onChange={(e) => setFormData({ ...formData, healthGoal: e.target.value })}
              >
                <option value="maintain">Maintain Current Weight &amp; Health</option>
                <option value="lose">Healthy Fat Loss (Deficit)</option>
                <option value="gain_muscle">Lean Muscle Gain (High Protein)</option>
                <option value="energy">Optimize Energy &amp; Digestion</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                className="auth-btn-demo"
                style={{ flex: 1 }}
                onClick={handlePrevStep}
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <button
                type="button"
                className="auth-btn-submit"
                style={{ flex: 2, marginTop: 0 }}
                disabled={loading}
                onClick={handleCompleteSignup}
              >
                <Sparkles size={18} />
                <span>{loading ? 'Creating...' : 'Finish Setup'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="auth-switch-prompt">
        Already have an account?
        <Link to="/auth/login" className="auth-switch-link">
          Sign In
        </Link>
      </div>
    </div>
  );
}
