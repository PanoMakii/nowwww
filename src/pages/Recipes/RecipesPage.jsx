import { useState, useEffect } from 'react';
import { Search, Clock, Flame, Bookmark, BookmarkCheck, PlusCircle, Filter } from 'lucide-react';
import { getRecipesApi, toggleSaveRecipeApi } from '../../api/recipes.js';
import RecipeDetailModal from '../../components/recipes/RecipeDetailModal.jsx';
import '../Pages.css';

const DEFAULT_RECIPES = [
  {
    id: 'r1',
    name: 'Grilled Salmon with Asparagus & Quinoa',
    category: 'High-Protein',
    description: 'Crispy skin pan-seared salmon fillet over fluffy herb quinoa and lemon-drizzled asparagus spears.',
    prepTime: '15 min',
    cookTime: '15 min',
    servings: 2,
    calories: 520,
    protein: 44,
    carbs: 34,
    fat: 22,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    tags: ['High-Protein', 'Gluten-Free', 'Omega-3', 'Dinner'],
    saved: false,
    ingredients: [
      { name: 'Atlantic Salmon Fillet', quantity: '350', unit: 'g' },
      { name: 'Quinoa (Cooked)', quantity: '200', unit: 'g' },
      { name: 'Fresh Asparagus Spears', quantity: '150', unit: 'g' },
      { name: 'Extra Virgin Olive Oil', quantity: '15', unit: 'ml' },
      { name: 'Fresh Lemon Juice & Sea Salt', quantity: '1', unit: 'tbsp' },
    ],
    instructions: [
      'Rinse quinoa and cook in vegetable stock for 15 minutes until tender.',
      'Toss asparagus in 5ml olive oil, salt, and black pepper. Roast at 200°C for 10 minutes.',
      'Season salmon with sea salt and cracked pepper. Heat skillet over medium-high heat with remaining oil.',
      'Place salmon skin-side down and sear for 4 minutes until golden and crisp, flip and cook 3 more minutes.',
      'Serve salmon atop warm quinoa with roasted asparagus and a squeeze of fresh lemon.',
    ],
  },
  {
    id: 'r2',
    name: 'Crispy Lemon Garlic Herb Chicken Thighs',
    category: 'Keto',
    description: 'Tender oven-roasted chicken thighs infused with rosemary, garlic, and zesty fresh lemon.',
    prepTime: '10 min',
    cookTime: '25 min',
    servings: 4,
    calories: 480,
    protein: 42,
    carbs: 4,
    fat: 32,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
    tags: ['Keto', 'Low-Carb', 'Paleo', 'Dinner'],
    saved: true,
    ingredients: [
      { name: 'Bone-in Chicken Thighs', quantity: '600', unit: 'g' },
      { name: 'Minced Garlic', quantity: '4', unit: 'cloves' },
      { name: 'Fresh Rosemary & Thyme', quantity: '2', unit: 'tbsp' },
      { name: 'Extra Virgin Olive Oil', quantity: '20', unit: 'ml' },
      { name: 'Lemon Slices', quantity: '1', unit: 'lemon' },
    ],
    instructions: [
      'Preheat oven to 210°C (410°F). Pat chicken thighs dry with paper towels.',
      'Combine minced garlic, chopped herbs, olive oil, salt, and pepper in a small bowl.',
      'Rub herb mixture generously all over the chicken, including under the skin.',
      'Arrange chicken and lemon slices in a cast-iron skillet or baking dish.',
      'Bake for 25-30 minutes until skin is crackling golden and internal temp reads 74°C.',
    ],
  },
  {
    id: 'r3',
    name: 'Mediterranean Chickpea Avocado Salad',
    category: 'Vegetarian',
    description: 'Refreshing crisp salad loaded with chickpeas, ripe avocado, Persian cucumbers, and tangy feta.',
    prepTime: '12 min',
    cookTime: '0 min',
    servings: 2,
    calories: 390,
    protein: 15,
    carbs: 45,
    fat: 18,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    tags: ['Vegetarian', 'High-Fiber', 'Lunch', 'Quick'],
    saved: false,
    ingredients: [
      { name: 'Canned Chickpeas (Rinsed)', quantity: '240', unit: 'g' },
      { name: 'Hass Avocado (Diced)', quantity: '120', unit: 'g' },
      { name: 'Diced Cucumbers & Cherry Tomatoes', quantity: '180', unit: 'g' },
      { name: 'Feta Cheese Crumbled', quantity: '50', unit: 'g' },
      { name: 'Lemon Herb Dressing', quantity: '2', unit: 'tbsp' },
    ],
    instructions: [
      'Drain and rinse the chickpeas thoroughly in cold water.',
      'Chop cucumbers, cherry tomatoes, and red onion into uniform bite-sized pieces.',
      'Gently dice the avocado and fold together in a large mixing bowl with the chickpeas.',
      'Drizzle with olive oil and lemon juice, sprinkle feta cheese, and season with oregano.',
    ],
  },
  {
    id: 'r4',
    name: 'Tofu & Edamame Soba Noodle Bowl',
    category: 'Vegan',
    description: 'Nutrient-rich buckwheat soba noodles with pan-crisped organic tofu and sesame ginger dressing.',
    prepTime: '15 min',
    cookTime: '10 min',
    servings: 2,
    calories: 430,
    protein: 26,
    carbs: 58,
    fat: 12,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    tags: ['Vegan', 'Plant-Based', 'Dairy-Free', 'Lunch'],
    saved: false,
    ingredients: [
      { name: 'Buckwheat Soba Noodles', quantity: '150', unit: 'g' },
      { name: 'Organic Firm Tofu', quantity: '250', unit: 'g' },
      { name: 'Shelled Edamame', quantity: '100', unit: 'g' },
      { name: 'Grated Carrots & Red Cabbage', quantity: '100', unit: 'g' },
      { name: 'Sesame Ginger Tamari Glaze', quantity: '30', unit: 'ml' },
    ],
    instructions: [
      'Boil soba noodles for 4-5 minutes, rinse immediately under cold water.',
      'Cube tofu and press dry. Pan-fry in sesame oil for 6 minutes until crispy.',
      'Steam shelled edamame for 3 minutes.',
      'Toss noodles, tofu, vegetables, and edamame together with dressing.',
    ],
  },
];

export default function RecipesPage() {
  const [recipes, setRecipes] = useState(DEFAULT_RECIPES);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getRecipesApi();
        if (data.length > 0) {
          setRecipes(data);
        }
      } catch (err) {
        console.warn('API error loading recipes:', err);
      }
    }
    loadRecipes();
  }, []);

  const toggleSave = async (id, e) => {
    e?.stopPropagation();
    try {
      await toggleSaveRecipeApi(id);
    } catch (err) {
      // Local fallback
    }
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, saved: !r.saved } : r))
    );
  };

  const filtered = recipes.filter((r) => {
    const matchesFilter =
      activeFilter === 'All' ||
      r.tags?.includes(activeFilter) ||
      r.category === activeFilter ||
      (activeFilter === 'Saved' && r.saved);
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Recipe Discovery</h1>
          <p className="page-subtitle">Nutritionist-calibrated recipes matched to your macro goals</p>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '28px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Saved', 'High-Protein', 'Keto', 'Vegetarian', 'Vegan', 'Gluten-Free'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`filter-chip ${activeFilter === filter ? 'selected' : ''}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="topnav-search" style={{ marginLeft: 'auto', width: '280px' }}>
          <Search size={16} color="#8C867E" />
          <input
            type="text"
            placeholder="Search recipes, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Recipe Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '24px',
        }}
      >
        {filtered.map((recipe) => (
          <div
            key={recipe.id}
            className="panel-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedRecipe(recipe)}
          >
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
              <img
                src={recipe.image}
                alt={recipe.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={(e) => toggleSave(recipe.id, e)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(20, 18, 16, 0.75)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  color: recipe.saved ? '#F4C430' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                title={recipe.saved ? 'Remove Bookmark' : 'Save Recipe'}
              >
                {recipe.saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>

              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  background: 'rgba(20, 18, 16, 0.8)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  color: '#F4C430',
                  fontWeight: 600,
                }}
              >
                {recipe.calories} kcal / serving
              </div>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px', lineHeight: '1.4' }}>
                {recipe.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#8E887E', marginBottom: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> {recipe.prepTime} prep
                </span>
                <span>•</span>
                <span>{recipe.protein}g Protein</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {(recipe.tags || []).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.72rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#B3ADA3',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '0.82rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRecipe(recipe);
                  }}
                >
                  <PlusCircle size={15} />
                  <span>View Recipe &amp; Log</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onBookmarkToggle={(id, saved) => {
          setRecipes((prev) =>
            prev.map((r) => (r.id === id ? { ...r, saved } : r))
          );
        }}
      />
    </div>
  );
}
