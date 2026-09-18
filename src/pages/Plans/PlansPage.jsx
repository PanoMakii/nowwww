import { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  Sliders,
  X,
} from 'lucide-react';
import { generatePlanApi } from '../../api/ai.js';
import { useAuth } from '../../context/AuthContext.jsx';
import '../Pages.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function PlansPage() {
  const { user } = useAuth();

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedList, setCopiedList] = useState(false);

  // Generator Options
  const [targetCalories, setTargetCalories] = useState(user?.preferences?.dailyCalories || 2150);
  const [targetProtein, setTargetProtein] = useState(user?.preferences?.dailyProteinG || 140);
  const [goal, setGoal] = useState('maintenance');

  // Weekly Schedule State
  const [weeklySchedule, setWeeklySchedule] = useState(null);
  const [categorizedGroceries, setCategorizedGroceries] = useState([]);
  const [checkedGroceries, setCheckedGroceries] = useState({});

  // Initial plan load
  useEffect(() => {
    async function loadInitialPlan() {
      try {
        const result = await generatePlanApi({
          targetCalories,
          targetProtein,
          goal,
          dietaryRestrictions: user?.preferences?.dietaryRestrictions || ['Balanced'],
        });
        if (result.weeklySchedule) {
          setWeeklySchedule(result.weeklySchedule);
          setCategorizedGroceries(result.categorizedGroceries || []);
        }
      } catch (err) {
        console.warn('Failed to load initial meal plan:', err);
      }
    }
    loadInitialPlan();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generatePlanApi({
        targetCalories,
        targetProtein,
        goal,
        dietaryRestrictions: user?.preferences?.dietaryRestrictions || ['Balanced'],
      });
      if (result.weeklySchedule) {
        setWeeklySchedule(result.weeklySchedule);
        setCategorizedGroceries(result.categorizedGroceries || []);
        setCheckedGroceries({});
      }
      setIsGeneratorOpen(false);
    } catch (err) {
      console.error('Plan generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  const toggleGrocery = (itemName) => {
    setCheckedGroceries((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const handleCopyGroceries = () => {
    let text = `# Recip52 Smart Grocery List\n\n`;
    categorizedGroceries.forEach((cat) => {
      text += `## ${cat.category}\n`;
      cat.items.forEach((item) => {
        const isDone = checkedGroceries[item.name];
        text += `- [${isDone ? 'x' : ' '}] ${item.name} (${item.quantity})\n`;
      });
      text += '\n';
    });
    navigator.clipboard.writeText(text);
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2000);
  };

  const currentDayData = weeklySchedule?.[selectedDay];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Smart 7-Day Meal Plans</h1>
          <p className="page-subtitle">
            Personalized nutritional schedules aligned with your daily calories and macronutrient goals
          </p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary" onClick={() => setIsGeneratorOpen(true)}>
            <RefreshCw size={16} />
            <span>Customize Plan</span>
          </button>
          <button className="btn-primary" onClick={() => setIsGeneratorOpen(true)}>
            <Sparkles size={16} />
            <span>Generate with AI</span>
          </button>
        </div>
      </div>

      {/* Day Selector */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: '12px 22px',
              borderRadius: '14px',
              border: selectedDay === day ? '1px solid #F4C430' : '1px solid rgba(255,255,255,0.08)',
              background: selectedDay === day ? 'rgba(244, 196, 48, 0.15)' : 'rgba(255,255,255,0.03)',
              color: selectedDay === day ? '#F4C430' : '#B3ADA3',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {day}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Planned Meals for Day */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">{selectedDay}&apos;s Nutrition Plan</h2>
              <span style={{ fontSize: '0.82rem', color: '#8E887E' }}>4 balanced meal segments</span>
            </div>
            {currentDayData?.totals && (
              <span style={{ fontSize: '0.9rem', color: '#F4C430', fontWeight: 700 }}>
                {currentDayData.totals.calories} kcal • {currentDayData.totals.protein}g Protein
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {currentDayData?.meals?.map((meal, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 20px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background:
                          meal.type === 'Breakfast'
                            ? 'rgba(244, 196, 48, 0.2)'
                            : meal.type === 'Lunch'
                            ? 'rgba(79, 121, 66, 0.2)'
                            : meal.type === 'Dinner'
                            ? 'rgba(255, 99, 71, 0.2)'
                            : 'rgba(168, 85, 247, 0.2)',
                        color:
                          meal.type === 'Breakfast'
                            ? '#F4C430'
                            : meal.type === 'Lunch'
                            ? '#7BB661'
                            : meal.type === 'Dinner'
                            ? '#FF6347'
                            : '#C084FC',
                      }}
                    >
                      {meal.type}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#8E887E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {meal.time}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '1.05rem' }}>
                    {meal.name}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#F4C430', fontSize: '1.1rem' }}>{meal.calories} kcal</div>
                  <div style={{ fontSize: '0.8rem', color: '#B3ADA3', marginTop: '2px' }}>
                    P: <strong style={{ color: '#FF6347' }}>{meal.protein}g</strong> • C: <strong style={{ color: '#7BB661' }}>{meal.carbs}g</strong> • F: <strong style={{ color: '#E5A812' }}>{meal.fat}g</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categorized Smart Grocery List */}
        <div className="panel-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div>
              <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={18} color="#F4C430" />
                <span>Smart Grocery List</span>
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#8E887E' }}>Auto-compiled for week</span>
            </div>
            <button
              onClick={handleCopyGroceries}
              className="topnav-icon-btn"
              style={{ width: '34px', height: '34px' }}
              title="Copy checklist to clipboard"
            >
              {copiedList ? <Check size={16} color="#7BB661" /> : <Copy size={16} />}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '540px' }}>
            {categorizedGroceries.map((cat, idx) => (
              <div key={idx}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F4C430', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  {cat.category}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {cat.items.map((item, itemIdx) => {
                    const isChecked = !!checkedGroceries[item.name];
                    return (
                      <label
                        key={itemIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.02)',
                          fontSize: '0.85rem',
                          color: isChecked ? '#6C665F' : '#ffffff',
                          textDecoration: isChecked ? 'line-through' : 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleGrocery(item.name)}
                          style={{ accentColor: '#F4C430', cursor: 'pointer' }}
                        />
                        <span style={{ flex: 1 }}>{item.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#8E887E' }}>{item.quantity}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-secondary"
            onClick={handleCopyGroceries}
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px', fontSize: '0.85rem' }}
          >
            {copiedList ? 'Copied to Clipboard!' : 'Copy Formatted Grocery List'}
          </button>
        </div>
      </div>

      {/* Generator Configuration Modal */}
      {isGeneratorOpen && (
        <div className="modal-overlay" onClick={() => setIsGeneratorOpen(false)}>
          <div className="add-meal-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                <Sparkles size={22} color="#F4C430" />
                <span>AI Meal Plan Generator</span>
              </h2>
              <button className="modal-close-btn" onClick={() => setIsGeneratorOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div>
                <label className="auth-label">Fitness &amp; Metabolic Goal</label>
                <select
                  className="auth-input"
                  style={{ paddingLeft: '14px', marginTop: '6px', background: '#25211E' }}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  <option value="maintenance">Clean Nutrition &amp; Maintenance</option>
                  <option value="fat_loss">Healthy Fat Loss (Caloric Deficit)</option>
                  <option value="muscle_gain">Lean Muscle Synthesis (High Protein)</option>
                  <option value="energy">Metabolic Vitality &amp; Clean Energy</option>
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span className="auth-label">Daily Target Calories</span>
                  <strong style={{ color: '#F4C430' }}>{targetCalories} kcal</strong>
                </div>
                <input
                  type="range"
                  min="1400"
                  max="3500"
                  step="50"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#F4C430', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span className="auth-label">Daily Target Protein</span>
                  <strong style={{ color: '#FF6347' }}>{targetProtein} g</strong>
                </div>
                <input
                  type="range"
                  min="60"
                  max="220"
                  step="5"
                  value={targetProtein}
                  onChange={(e) => setTargetProtein(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#FF6347', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setIsGeneratorOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={generating}
                onClick={handleGenerate}
                style={{ minWidth: '180px', justifyContent: 'center' }}
              >
                <Sparkles size={16} />
                <span>{generating ? 'Compiling Week...' : 'Generate 7 Days'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
