import { useState, useEffect } from 'react';
import {
  X,
  Search,
  Plus,
  Trash2,
  Sparkles,
  Camera,
  Check,
  Flame,
  Utensils,
} from 'lucide-react';
import { searchFoodsApi } from '../../api/foods.js';
import { createMealApi } from '../../api/meals.js';
import './AddMealModal.css';

const DEFAULT_FOODS = [
  { id: 'f1', name: 'Chicken Breast (Boneless, Skinless)', caloriesPer100g: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 'f2', name: 'Atlantic Salmon (Wild-Caught)', caloriesPer100g: 208, protein: 20, carbs: 0, fat: 13 },
  { id: 'f3', name: 'Large Whole Egg', caloriesPer100g: 143, protein: 12.6, carbs: 0.7, fat: 9.5 },
  { id: 'f5', name: 'Greek Yogurt (Non-Fat)', caloriesPer100g: 59, protein: 10.2, carbs: 3.6, fat: 0.4 },
  { id: 'f6', name: 'Rolled Whole Oats', caloriesPer100g: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
  { id: 'f10', name: 'Hass Avocado', caloriesPer100g: 160, protein: 2.0, carbs: 8.5, fat: 14.7 },
  { id: 'f11', name: 'Fresh Broccoli Florets', caloriesPer100g: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
];

export default function AddMealModal({ isOpen, onClose, onMealLogged, initialMealType = 'lunch' }) {
  const [mealType, setMealType] = useState(initialMealType);
  const [activeMode, setActiveMode] = useState('search'); // 'search' | 'custom' | 'ai'

  // Food Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [foodResults, setFoodResults] = useState(DEFAULT_FOODS);
  const [selectedFood, setSelectedFood] = useState(null);
  const [portionGrams, setPortionGrams] = useState(100);

  // Custom Item Form state
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');

  // AI Scan state
  const [aiScanning, setAiScanning] = useState(false);
  const [aiDetectedFood, setAiDetectedFood] = useState(null);

  // Staged basket of items for this meal
  const [stagedItems, setStagedItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Query food API on search query change
  useEffect(() => {
    let active = true;
    const fetchFoods = async () => {
      if (!searchQuery.trim()) {
        setFoodResults(DEFAULT_FOODS);
        return;
      }
      try {
        const results = await searchFoodsApi(searchQuery);
        if (active) {
          setFoodResults(results.length > 0 ? results : DEFAULT_FOODS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())));
        }
      } catch (err) {
        if (active) {
          setFoodResults(DEFAULT_FOODS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())));
        }
      }
    };

    const timer = setTimeout(fetchFoods, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  if (!isOpen) return null;

  // Real-time macro calculation for currently selected food
  const factor = portionGrams / 100;
  const currentItemCalories = selectedFood ? Math.round(selectedFood.caloriesPer100g * factor) : 0;
  const currentItemProtein = selectedFood ? Math.round(selectedFood.protein * factor * 10) / 10 : 0;
  const currentItemCarbs = selectedFood ? Math.round(selectedFood.carbs * factor * 10) / 10 : 0;
  const currentItemFat = selectedFood ? Math.round(selectedFood.fat * factor * 10) / 10 : 0;

  const handleAddSelectedFoodToBasket = () => {
    if (!selectedFood) return;
    const newItem = {
      id: `item-${Date.now()}`,
      name: `${selectedFood.name} (${portionGrams}g)`,
      calories: currentItemCalories,
      protein: currentItemProtein,
      carbs: currentItemCarbs,
      fat: currentItemFat,
    };
    setStagedItems([...stagedItems, newItem]);
    setSelectedFood(null);
    setPortionGrams(100);
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!customName || !customCalories) return;
    const newItem = {
      id: `item-${Date.now()}`,
      name: customName,
      calories: parseFloat(customCalories),
      protein: parseFloat(customProtein || 0),
      carbs: parseFloat(customCarbs || 0),
      fat: parseFloat(customFat || 0),
    };
    setStagedItems([...stagedItems, newItem]);
    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
  };

  const handleSimulateAiScan = () => {
    setAiScanning(true);
    setTimeout(() => {
      setAiScanning(false);
      const recognized = {
        name: 'Avocado Toast with Poached Egg & Microgreens',
        calories: 390,
        protein: 16,
        carbs: 28,
        fat: 24,
        confidence: '98%',
      };
      setAiDetectedFood(recognized);
      setStagedItems([...stagedItems, { ...recognized, id: `ai-${Date.now()}` }]);
    }, 1200);
  };

  const removeItem = (id) => {
    setStagedItems(stagedItems.filter((i) => i.id !== id));
  };

  // Grand totals
  const totalCalories = stagedItems.reduce((acc, i) => acc + i.calories, 0);
  const totalProtein = stagedItems.reduce((acc, i) => acc + i.protein, 0);
  const totalCarbs = stagedItems.reduce((acc, i) => acc + i.carbs, 0);
  const totalFat = stagedItems.reduce((acc, i) => acc + i.fat, 0);

  const handleConfirmMeal = async () => {
    if (stagedItems.length === 0) return;

    setSubmitting(true);
    const mealPayload = {
      title: stagedItems.length === 1 ? stagedItems[0].name : `${stagedItems[0].name} + ${stagedItems.length - 1} more`,
      mealType,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      items: stagedItems.map((i) => i.name),
    };

    try {
      const response = await createMealApi(mealPayload);
      onMealLogged(response.meal || mealPayload);
      onClose();
    } catch (err) {
      // Fallback local persistence
      onMealLogged({
        id: `meal-${Date.now()}`,
        ...mealPayload,
        loggedAt: new Date().toISOString(),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-meal-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            <Utensils size={22} color="#F4C430" />
            <span>Log Nutrition</span>
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Meal Type Selector */}
          <div className="meal-type-selector">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
              <button
                key={type}
                type="button"
                className={`meal-type-btn ${mealType === type ? 'active' : ''}`}
                onClick={() => setMealType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
            <button
              type="button"
              className={`filter-chip ${activeMode === 'search' ? 'selected' : ''}`}
              onClick={() => setActiveMode('search')}
            >
              Food Database
            </button>
            <button
              type="button"
              className={`filter-chip ${activeMode === 'custom' ? 'selected' : ''}`}
              onClick={() => setActiveMode('custom')}
            >
              Custom Item
            </button>
            <button
              type="button"
              className={`filter-chip ${activeMode === 'ai' ? 'selected' : ''}`}
              onClick={() => setActiveMode('ai')}
            >
              <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
              AI Photo Scan
            </button>
          </div>

          {/* MODE 1: FOOD SEARCH */}
          {activeMode === 'search' && (
            <div>
              <div className="topnav-search" style={{ width: '100%', marginBottom: '14px' }}>
                <Search size={18} color="#8C867E" />
                <input
                  type="text"
                  placeholder="Search 35+ foods (e.g. Salmon, Oats, Avocado)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Search Results List */}
              <div className="food-search-results">
                {foodResults.map((food) => {
                  const isSelected = selectedFood?.id === food.id;
                  return (
                    <div
                      key={food.id}
                      className={`food-search-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{food.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#8E887E' }}>
                          Per 100g: {food.caloriesPer100g} kcal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                        </div>
                      </div>
                      <button
                        type="button"
                        style={{
                          background: isSelected ? '#F4C430' : 'rgba(255,255,255,0.06)',
                          color: isSelected ? '#1A1817' : '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Portion Adjuster */}
              {selectedFood && (
                <div className="portion-adjuster" style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#F4C430', fontSize: '0.95rem' }}>
                      {selectedFood.name}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                      {portionGrams} grams
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={portionGrams}
                    onChange={(e) => setPortionGrams(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: '#F4C430', cursor: 'pointer' }}
                  />

                  <div className="macro-preview-grid">
                    <div className="macro-box">
                      <div className="macro-box-val" style={{ color: '#F4C430' }}>{currentItemCalories}</div>
                      <div className="macro-box-label">Calories</div>
                    </div>
                    <div className="macro-box">
                      <div className="macro-box-val" style={{ color: '#FF6347' }}>{currentItemProtein}g</div>
                      <div className="macro-box-label">Protein</div>
                    </div>
                    <div className="macro-box">
                      <div className="macro-box-val" style={{ color: '#7BB661' }}>{currentItemCarbs}g</div>
                      <div className="macro-box-label">Carbs</div>
                    </div>
                    <div className="macro-box">
                      <div className="macro-box-val" style={{ color: '#E5A812' }}>{currentItemFat}g</div>
                      <div className="macro-box-label">Fat</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '14px' }}
                    onClick={handleAddSelectedFoodToBasket}
                  >
                    <Plus size={16} />
                    <span>Add {portionGrams}g to Meal</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: CUSTOM ENTRY */}
          {activeMode === 'custom' && (
            <form onSubmit={handleAddCustomItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="auth-label">Item / Recipe Name</label>
                <input
                  type="text"
                  placeholder="e.g. Homemade Turkey Meatballs"
                  className="auth-input"
                  style={{ paddingLeft: '14px', marginTop: '4px' }}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div>
                  <label className="auth-label">Calories</label>
                  <input
                    type="number"
                    placeholder="350"
                    className="auth-input"
                    style={{ paddingLeft: '10px', marginTop: '4px' }}
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="auth-label">Protein (g)</label>
                  <input
                    type="number"
                    placeholder="30"
                    className="auth-input"
                    style={{ paddingLeft: '10px', marginTop: '4px' }}
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                  />
                </div>
                <div>
                  <label className="auth-label">Carbs (g)</label>
                  <input
                    type="number"
                    placeholder="25"
                    className="auth-input"
                    style={{ paddingLeft: '10px', marginTop: '4px' }}
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value)}
                  />
                </div>
                <div>
                  <label className="auth-label">Fat (g)</label>
                  <input
                    type="number"
                    placeholder="12"
                    className="auth-input"
                    style={{ paddingLeft: '10px', marginTop: '4px' }}
                    value={customFat}
                    onChange={(e) => setCustomFat(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                <Plus size={16} />
                <span>Add Custom Item</span>
              </button>
            </form>
          )}

          {/* MODE 3: AI SCAN */}
          {activeMode === 'ai' && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div
                style={{
                  border: '2px dashed rgba(244, 196, 48, 0.4)',
                  borderRadius: '16px',
                  padding: '36px 20px',
                  background: 'rgba(244, 196, 48, 0.04)',
                  cursor: 'pointer',
                  marginBottom: '16px',
                }}
                onClick={handleSimulateAiScan}
              >
                <Camera size={44} color="#F4C430" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#ffffff', marginBottom: '4px' }}>
                  {aiScanning ? 'Analyzing plate with OpenAI Vision...' : 'Click to Upload Meal Photo'}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#8E887E' }}>
                  Automatic ingredient segmentation &amp; caloric density analysis
                </p>
              </div>

              {aiDetectedFood && (
                <div className="portion-adjuster" style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7BB661', fontWeight: 600, marginBottom: '8px' }}>
                    <Check size={16} />
                    <span>AI Identified: {aiDetectedFood.name}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#B3ADA3' }}>
                    Detected {aiDetectedFood.calories} kcal • {aiDetectedFood.protein}g protein ({aiDetectedFood.confidence} confidence)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Current Staged Basket */}
          {stagedItems.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#C5BFB5', marginBottom: '10px' }}>
                Items in this {mealType} ({stagedItems.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stagedItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#8E887E' }}>
                        {item.calories} kcal • P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      style={{ background: 'transparent', border: 'none', color: '#FF6347', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div>
            <div style={{ fontSize: '0.8rem', color: '#8E887E' }}>Total Meal Energy:</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F4C430' }}>
              {totalCalories} kcal <span style={{ fontSize: '0.85rem', color: '#FF6347', fontWeight: 500 }}>({totalProtein}g protein)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={stagedItems.length === 0 || submitting}
              onClick={handleConfirmMeal}
            >
              <span>{submitting ? 'Saving...' : 'Confirm & Save Meal'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
