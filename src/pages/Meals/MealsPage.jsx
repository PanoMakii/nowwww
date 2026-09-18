import { useState, useEffect } from 'react';
import {
  Camera,
  Search,
  Plus,
  Clock,
  Trash2,
  Edit2,
  Sparkles,
  Flame,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getMealsApi, deleteMealApi } from '../../api/meals.js';
import AddMealModal from '../../components/meals/AddMealModal.jsx';
import '../Pages.css';

export default function MealsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('lunch');
  const [currentDateOffset, setCurrentDateOffset] = useState(0); // 0 = Today, -1 = Yesterday

  const [meals, setMeals] = useState([]);

  const getDateLabel = (offset) => {
    if (offset === 0) return 'Today';
    if (offset === -1) return 'Yesterday';
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  useEffect(() => {
    async function loadMeals() {
      try {
        const data = await getMealsApi();
        if (data.meals && data.meals.length > 0) {
          setMeals(data.meals);
        } else {
          setMeals([
            {
              id: 'm1',
              title: 'Avocado Toast with Poached Eggs',
              mealType: 'breakfast',
              calories: 420,
              protein: 18,
              carbs: 32,
              fat: 22,
              time: '08:15 AM',
              items: ['2 Slices Sourdough', '1 Hass Avocado', '2 Free-range Eggs'],
            },
            {
              id: 'm2',
              title: 'Mediterranean Grilled Chicken Salad',
              mealType: 'lunch',
              calories: 580,
              protein: 52,
              carbs: 24,
              fat: 28,
              time: '01:30 PM',
              items: ['200g Chicken Breast', 'Feta Cheese', 'Mixed Greens', 'Olive Oil Dressing'],
            },
            {
              id: 'm3',
              title: 'Vanilla Whey Protein Shake & Banana',
              mealType: 'snack',
              calories: 260,
              protein: 30,
              carbs: 28,
              fat: 3,
              time: '04:45 PM',
              items: ['1 Scoop Whey Isolate', '1 Medium Banana', '300ml Almond Milk'],
            },
          ]);
        }
      } catch (err) {
        console.warn('Failed to load meals from API:', err);
      }
    }
    loadMeals();
  }, []);

  const handleMealLogged = (newMeal) => {
    setMeals([
      {
        id: newMeal.id || `m-${Date.now()}`,
        time: 'Just now',
        items: newMeal.items || [newMeal.title],
        ...newMeal,
      },
      ...meals,
    ]);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMealApi(id);
    } catch (e) {
      // Keep going
    }
    setMeals(meals.filter((m) => m.id !== id));
  };

  const filteredMeals = meals.filter((meal) => {
    const matchesTab = activeTab === 'all' || meal.mealType === activeTab;
    const matchesQuery = meal.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const totalCalories = filteredMeals.reduce((s, m) => s + (parseFloat(m.calories) || 0), 0);
  const totalProtein = filteredMeals.reduce((s, m) => s + (parseFloat(m.protein) || 0), 0);
  const totalCarbs = filteredMeals.reduce((s, m) => s + (parseFloat(m.carbs) || 0), 0);
  const totalFat = filteredMeals.reduce((s, m) => s + (parseFloat(m.fat) || 0), 0);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Meal Tracker</h1>
          <p className="page-subtitle">Track your daily intake with manual lookup or instant AI photo scan</p>
        </div>
        <div className="page-actions">
          <button
            className="btn-secondary"
            onClick={() => {
              setSelectedMealType('lunch');
              setShowLogModal(true);
            }}
          >
            <Camera size={18} color="#F4C430" />
            <span>AI Photo Scan</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setSelectedMealType('lunch');
              setShowLogModal(true);
            }}
          >
            <Plus size={18} />
            <span>Log Meal</span>
          </button>
        </div>
      </div>

      {/* Date Navigation & Summary Bar */}
      <div
        className="panel-card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCurrentDateOffset((prev) => prev - 1)}
            title="Previous Day"
          >
            <ChevronLeft size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#F4C430" />
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>
              {getDateLabel(currentDateOffset)}
            </span>
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCurrentDateOffset((prev) => Math.min(prev + 1, 0))}
            disabled={currentDateOffset === 0}
            style={{ opacity: currentDateOffset === 0 ? 0.3 : 1 }}
            title="Next Day"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: '#8E887E' }}>Energy: </span>
            <strong style={{ color: '#F4C430' }}>{Math.round(totalCalories)} kcal</strong>
          </div>
          <div>
            <span style={{ color: '#8E887E' }}>Protein: </span>
            <strong style={{ color: '#FF6347' }}>{Math.round(totalProtein)}g</strong>
          </div>
          <div>
            <span style={{ color: '#8E887E' }}>Carbs: </span>
            <strong style={{ color: '#7BB661' }}>{Math.round(totalCarbs)}g</strong>
          </div>
          <div>
            <span style={{ color: '#8E887E' }}>Fat: </span>
            <strong style={{ color: '#E5A812' }}>{Math.round(totalFat)}g</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px' }}>
          {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#F4C430' : 'transparent',
                color: activeTab === tab ? '#1A1817' : '#B3ADA3',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="topnav-search" style={{ width: '280px', marginLeft: 'auto' }}>
          <Search size={16} color="#8C867E" />
          <input
            type="text"
            placeholder="Filter logged meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Meal History List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredMeals.map((meal) => (
          <div key={meal.id} className="panel-card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span
                    style={{
                      textTransform: 'uppercase',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background:
                        meal.mealType === 'breakfast'
                          ? 'rgba(244, 196, 48, 0.2)'
                          : meal.mealType === 'lunch'
                          ? 'rgba(79, 121, 66, 0.2)'
                          : 'rgba(255, 99, 71, 0.2)',
                      color:
                        meal.mealType === 'breakfast'
                          ? '#F4C430'
                          : meal.mealType === 'lunch'
                          ? '#7BB661'
                          : '#FF6347',
                    }}
                  >
                    {meal.mealType}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#8E887E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {meal.time || '12:30 PM'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                  {meal.title}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(meal.items || []).map((item, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.78rem',
                        color: '#B3ADA3',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F4C430' }}>
                    {meal.calories} <span style={{ fontSize: '0.85rem', color: '#8E887E' }}>kcal</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#B3ADA3', display: 'flex', gap: '8px', marginTop: '2px' }}>
                    <span>P: <strong style={{ color: '#FF6347' }}>{meal.protein}g</strong></span>
                    <span>C: <strong style={{ color: '#7BB661' }}>{meal.carbs}g</strong></span>
                    <span>F: <strong style={{ color: '#E5A812' }}>{meal.fat}g</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="topnav-icon-btn"
                    style={{ width: '34px', height: '34px', color: '#FF6347' }}
                    title="Delete meal"
                    onClick={() => handleDelete(meal.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Meal Modal */}
      <AddMealModal
        isOpen={showLogModal}
        initialMealType={selectedMealType}
        onClose={() => setShowLogModal(false)}
        onMealLogged={handleMealLogged}
      />
    </div>
  );
}
