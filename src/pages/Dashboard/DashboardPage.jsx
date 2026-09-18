import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  PlusCircle,
  Sparkles,
  Camera,
  ArrowRight,
  Clock,
  ChevronRight,
  Trash2,
  Award,
  Lightbulb,
  CheckCircle2,
  Watch,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getMealsApi, deleteMealApi } from '../../api/meals.js';
import { getRecipesApi } from '../../api/recipes.js';
import { getNutritionalInsightsApi } from '../../api/analytics.js';
import { getWearablesApi } from '../../api/wearables.js';
import AddMealModal from '../../components/meals/AddMealModal.jsx';
import RecipeDetailModal from '../../components/recipes/RecipeDetailModal.jsx';
import PhotoAnalysisModal from '../../components/meals/PhotoAnalysisModal.jsx';
import '../Pages.css';
import './Dashboard.css';

const WEEKDAYS = [
  { day: 'Mon', calories: 2050, target: 2150 },
  { day: 'Tue', calories: 2120, target: 2150 },
  { day: 'Wed', calories: 1980, target: 2150 },
  { day: 'Thu', calories: 2240, target: 2150 },
  { day: 'Fri', calories: 1850, target: 2150 },
  { day: 'Sat', calories: 2310, target: 2150 },
  { day: 'Sun (Today)', calories: 1420, target: 2150, isToday: true },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const [meals, setMeals] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [insights, setInsights] = useState(null);
  const [wearableTelemetry, setWearableTelemetry] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [activeChartDay, setActiveChartDay] = useState('Sun (Today)');

  // Target values from user preferences or defaults
  const dailyCaloriesTarget = user?.preferences?.dailyCalories || 2150;
  const proteinTarget = user?.preferences?.dailyProteinG || 140;
  const carbsTarget = user?.preferences?.dailyCarbsG || 210;
  const fatTarget = user?.preferences?.dailyFatG || 65;
  const waterTarget = user?.preferences?.dailyWaterMl || 3000;

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const mealData = await getMealsApi();
        if (mealData.meals && mealData.meals.length > 0) {
          setMeals(mealData.meals);
        } else {
          setMeals([
            {
              id: 'm1',
              title: 'Greek Yogurt Bowl with Berries & Chia',
              mealType: 'breakfast',
              calories: 380,
              protein: 28,
              carbs: 45,
              fat: 8,
              time: '8:30 AM',
              emoji: '🫐',
            },
            {
              id: 'm2',
              title: 'Grilled Salmon & Quinoa Bowl',
              mealType: 'lunch',
              calories: 640,
              protein: 46,
              carbs: 52,
              fat: 26,
              time: '1:15 PM',
              emoji: '🥗',
            },
            {
              id: 'm3',
              title: 'Raw Almonds & Green Apple',
              mealType: 'snack',
              calories: 220,
              protein: 6,
              carbs: 24,
              fat: 14,
              time: '4:45 PM',
              emoji: '🍏',
            },
          ]);
        }

        const recipeData = await getRecipesApi();
        if (recipeData.length > 0) {
          setRecipes(recipeData.slice(0, 3));
        }

        const insightsData = await getNutritionalInsightsApi();
        if (insightsData) {
          setInsights(insightsData);
        }

        const wearableData = await getWearablesApi();
        if (wearableData.telemetry) {
          setWearableTelemetry(wearableData.telemetry);
        }
      } catch (err) {
        console.warn('Could not load dashboard data from API:', err);
      }
    }
    loadData();
  }, []);

  // Compute live today's totals from meals state
  const consumedCalories = meals.reduce((sum, m) => sum + (parseFloat(m.calories) || 0), 0);
  const consumedProtein = meals.reduce((sum, m) => sum + (parseFloat(m.protein) || 0), 0);
  const consumedCarbs = meals.reduce((sum, m) => sum + (parseFloat(m.carbs) || 0), 0);
  const consumedFat = meals.reduce((sum, m) => sum + (parseFloat(m.fat) || 0), 0);
  const consumedWater = 2200;

  const activeBurn = wearableTelemetry?.caloriesBurned || 520;
  const netCalories = Math.max(0, consumedCalories - activeBurn);
  const remainingCalories = Math.max(0, dailyCaloriesTarget - consumedCalories);

  const handleMealLogged = (newMeal) => {
    const enriched = {
      ...newMeal,
      id: newMeal.id || `meal-${Date.now()}`,
      time: 'Just now',
      emoji:
        newMeal.mealType === 'breakfast'
          ? '🍳'
          : newMeal.mealType === 'lunch'
          ? '🥗'
          : newMeal.mealType === 'dinner'
          ? '🍲'
          : '🍎',
    };
    setMeals([enriched, ...meals]);
  };

  const handleDeleteMeal = async (id) => {
    try {
      await deleteMealApi(id);
    } catch (e) {
      // Local fallback
    }
    setMeals(meals.filter((m) => m.id !== id));
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-text">
          <h1>Welcome back, {user?.firstName || 'Chef'}! 🌿</h1>
          <p>
            You have consumed <strong>{consumedCalories} kcal</strong> today. You have <strong>{remainingCalories} kcal</strong> remaining toward your target.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', alignItems: 'center' }}>
            <Link
              to="/wearables"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: '#F4C430',
                background: 'rgba(244, 196, 48, 0.12)',
                padding: '3px 10px',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <Watch size={13} />
              <span>Apple Health: +{activeBurn} active kcal burned</span>
            </Link>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn-secondary" onClick={() => setIsPhotoModalOpen(true)}>
            <Camera size={18} color="#F4C430" />
            <span>AI Photo Scan</span>
          </button>
          <button className="btn-primary" onClick={() => setIsAddMealOpen(true)}>
            <PlusCircle size={18} />
            <span>Log Meal</span>
          </button>
        </div>
      </div>

      {/* Daily Progress Stats */}
      <div className="stats-grid-4">
        {/* Calories */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Energy Balance</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(244, 196, 48, 0.15)', color: '#F4C430' }}>
              <Flame size={20} />
            </div>
          </div>
          <div className="stat-card-value">
            {consumedCalories} <span style={{ fontSize: '1rem', color: '#8E887E' }}>/ {dailyCaloriesTarget} kcal</span>
          </div>
          <div className="stat-progress-bar">
            <div
              className="stat-progress-fill"
              style={{
                width: `${Math.min((consumedCalories / dailyCaloriesTarget) * 100, 100)}%`,
                background: '#F4C430',
              }}
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#B3ADA3', marginTop: '2px' }}>
            Net: {netCalories} kcal (after {activeBurn} kcal active burn)
          </span>
        </div>

        {/* Protein */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Protein Goal</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(255, 99, 71, 0.15)', color: '#FF6347' }}>
              <Dumbbell size={20} />
            </div>
          </div>
          <div className="stat-card-value">
            {Math.round(consumedProtein)}g <span style={{ fontSize: '1rem', color: '#8E887E' }}>/ {proteinTarget}g</span>
          </div>
          <div className="stat-progress-bar">
            <div
              className="stat-progress-fill"
              style={{
                width: `${Math.min((consumedProtein / proteinTarget) * 100, 100)}%`,
                background: '#FF6347',
              }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Carbohydrates</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(79, 121, 66, 0.18)', color: '#7BB661' }}>
              <Wheat size={20} />
            </div>
          </div>
          <div className="stat-card-value">
            {Math.round(consumedCarbs)}g <span style={{ fontSize: '1rem', color: '#8E887E' }}>/ {carbsTarget}g</span>
          </div>
          <div className="stat-progress-bar">
            <div
              className="stat-progress-fill"
              style={{
                width: `${Math.min((consumedCarbs / carbsTarget) * 100, 100)}%`,
                background: '#7BB661',
              }}
            />
          </div>
        </div>

        {/* Water */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Hydration</span>
            <div className="stat-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
              <Droplet size={20} />
            </div>
          </div>
          <div className="stat-card-value">
            {(consumedWater / 1000).toFixed(1)}L <span style={{ fontSize: '1rem', color: '#8E887E' }}>/ {(waterTarget / 1000).toFixed(1)}L</span>
          </div>
          <div className="stat-progress-bar">
            <div
              className="stat-progress-fill"
              style={{
                width: `${Math.min((consumedWater / waterTarget) * 100, 100)}%`,
                background: '#38BDF8',
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Nutritionist Insights Bar */}
      {insights && (
        <div
          className="panel-card"
          style={{
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(30, 26, 24, 0.8) 0%, rgba(244, 196, 48, 0.06) 100%)',
            border: '1px solid rgba(244, 196, 48, 0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="#F4C430" />
              <h2 className="panel-title" style={{ margin: 0 }}>AI Nutritionist Coaching Insights</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  background: 'rgba(244, 196, 48, 0.2)',
                  color: '#F4C430',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Award size={14} /> {insights.streakDays}-Day Consistency Streak
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {(insights.aiCoachingRecommendations || []).map((rec) => (
              <div
                key={rec.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Lightbulb size={15} color={rec.type === 'positive' ? '#7BB661' : '#F4C430'} />
                  <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{rec.title}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#B3ADA3', lineHeight: '1.4' }}>
                  {rec.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Stats Bar Chart */}
      <div className="panel-card" style={{ marginBottom: '24px' }}>
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Weekly Calorie Performance</h2>
            <span style={{ fontSize: '0.82rem', color: '#8E887E' }}>
              Selected: <strong style={{ color: '#F4C430' }}>{activeChartDay}</strong> • Target: {dailyCaloriesTarget} kcal/day
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', padding: '16px 8px 0 8px', gap: '12px' }}>
          {WEEKDAYS.map((w) => {
            const currentCal = w.isToday ? consumedCalories : w.calories;
            const pct = Math.min((currentCal / 2600) * 100, 100);
            const isTargetMet = currentCal >= dailyCaloriesTarget * 0.9 && currentCal <= dailyCaloriesTarget * 1.1;
            const isSelected = activeChartDay === w.day;

            return (
              <div
                key={w.day}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', cursor: 'pointer' }}
                onClick={() => setActiveChartDay(w.day)}
              >
                <div style={{ fontSize: '0.75rem', color: isSelected ? '#F4C430' : '#8E887E', fontWeight: 600, marginBottom: '6px' }}>
                  {currentCal}
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '42px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: isSelected ? '1px solid #F4C430' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${pct}%`,
                      background: w.isToday
                        ? 'linear-gradient(180deg, #F4C430 0%, #E5A812 100%)'
                        : isTargetMet
                        ? 'rgba(79, 121, 66, 0.75)'
                        : 'rgba(255, 99, 71, 0.75)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.4s ease',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.78rem', color: isSelected ? '#F4C430' : '#C5BFB5', fontWeight: 600, marginTop: '8px' }}>
                  {w.day.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Recent Meals + Suggested Recipes */}
      <div className="dashboard-grid-2">
        {/* Left Column: Recent Meals */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Today&apos;s Logged Meals</h2>
              <span style={{ fontSize: '0.82rem', color: '#8E887E' }}>{meals.length} meals recorded</span>
            </div>
            <Link to="/meals" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
              Full History
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {meals.map((meal) => (
              <div key={meal.id} className="meal-item-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="meal-icon">{meal.emoji || '🥗'}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>{meal.title}</div>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: '#8E887E', marginTop: '2px' }}>
                      <span style={{ textTransform: 'capitalize' }}>{meal.mealType}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {meal.time || '12:00 PM'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#F4C430' }}>{meal.calories} kcal</div>
                    <div style={{ fontSize: '0.78rem', color: '#FF6347' }}>{meal.protein}g protein</div>
                  </div>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    style={{ background: 'transparent', border: 'none', color: '#6C665F', cursor: 'pointer', padding: '4px' }}
                    title="Remove meal"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Camera size={18} color="#F4C430" />
              <span>Scan Photo</span>
            </button>
            <button
              onClick={() => setIsAddMealOpen(true)}
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <PlusCircle size={18} />
              <span>Log Meal</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Recipe Recommendations */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#F4C430" />
                <span>AI Suggested Recipes</span>
              </h2>
              <span style={{ fontSize: '0.82rem', color: '#8E887E' }}>Click to view details or log as meal</span>
            </div>
          </div>

          <div>
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-suggestion-card"
                onClick={() => setSelectedRecipe(recipe)}
                style={{ cursor: 'pointer' }}
              >
                <img src={recipe.image} alt={recipe.name} className="recipe-suggestion-img" />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#ffffff', lineHeight: '1.3', marginBottom: '4px' }}>
                    {recipe.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#9E988E', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#F4C430' }}>{recipe.calories} kcal</span>
                    <span>•</span>
                    <span>{recipe.prepTime}</span>
                  </div>
                </div>
                <ChevronRight size={18} color="#6C665F" style={{ marginLeft: 'auto', alignSelf: 'center' }} />
              </div>
            ))}
          </div>

          <Link
            to="/recipes"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#F4C430',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginTop: '12px',
            }}
          >
            <span>Explore Recipe Library</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Add Meal Modal */}
      <AddMealModal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        onMealLogged={handleMealLogged}
      />

      {/* Photo Analysis Modal */}
      <PhotoAnalysisModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onMealLogged={handleMealLogged}
      />

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onMealLogged={handleMealLogged}
      />
    </div>
  );
}
