import { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Flame,
  Bookmark,
  BookmarkCheck,
  PlusCircle,
  CheckCircle2,
  Users,
  ChefHat,
  Sparkles,
  Star,
  MessageSquare,
  Send,
} from 'lucide-react';
import { toggleSaveRecipeApi, getRecipeReviewsApi, addRecipeReviewApi } from '../../api/recipes.js';
import { createMealApi } from '../../api/meals.js';
import './RecipeDetailModal.css';

export default function RecipeDetailModal({ recipe, isOpen, onClose, onMealLogged, onBookmarkToggle }) {
  const [servingsMultiplier, setServingsMultiplier] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [isSaved, setIsSaved] = useState(recipe?.saved || false);
  const [loggingAsMeal, setLoggingAsMeal] = useState(false);
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  // Reviews & Community feedback
  const [reviews, setReviews] = useState(recipe?.reviews || []);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    if (recipe?.id && isOpen) {
      getRecipeReviewsApi(recipe.id)
        .then((res) => {
          if (Array.isArray(res) && res.length > 0) {
            setReviews(res);
          }
        })
        .catch(() => {});
    }
  }, [recipe?.id, isOpen]);

  if (!isOpen || !recipe) return null;

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleBookmark = async () => {
    try {
      await toggleSaveRecipeApi(recipe.id);
      setIsSaved(!isSaved);
      if (onBookmarkToggle) onBookmarkToggle(recipe.id, !isSaved);
    } catch (e) {
      setIsSaved(!isSaved);
    }
  };

  const handleLogAsMeal = async () => {
    setLoggingAsMeal(true);
    const mealPayload = {
      title: recipe.name,
      mealType: 'lunch',
      calories: Math.round(recipe.calories * servingsMultiplier),
      protein: Math.round(recipe.protein * servingsMultiplier),
      carbs: Math.round(recipe.carbs * servingsMultiplier),
      fat: Math.round(recipe.fat * servingsMultiplier),
      items: (recipe.ingredients || []).map((i) => `${i.quantity * servingsMultiplier} ${i.unit} ${i.name}`),
    };

    try {
      const result = await createMealApi(mealPayload);
      if (onMealLogged) onMealLogged(result.meal || mealPayload);
    } catch (err) {
      if (onMealLogged) {
        onMealLogged({
          id: `recipe-log-${Date.now()}`,
          ...mealPayload,
          loggedAt: new Date().toISOString(),
        });
      }
    } finally {
      setLoggingAsMeal(false);
      setLoggedSuccess(true);
      setTimeout(() => {
        setLoggedSuccess(false);
        onClose();
      }, 1200);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await addRecipeReviewApi(recipe.id, {
        rating: newRating,
        comment: newComment.trim(),
      });
      if (res.review) {
        setReviews([res.review, ...reviews]);
      }
      setNewComment('');
      setReviewMsg('Thank you! Your review has been posted.');
      setTimeout(() => setReviewMsg(''), 3000);
    } catch (err) {
      const localRev = {
        id: `rev_${Date.now()}`,
        recipeId: recipe.id,
        userName: 'Alex Johnson (You)',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
        rating: newRating,
        comment: newComment.trim(),
        createdAt: new Date().toISOString(),
      };
      setReviews([localRev, ...reviews]);
      setNewComment('');
      setReviewMsg('Review added!');
      setTimeout(() => setReviewMsg(''), 3000);
    } finally {
      setSubmittingReview(false);
    }
  };

  const totalCalories = Math.round(recipe.calories * servingsMultiplier);
  const totalProtein = Math.round(recipe.protein * servingsMultiplier);
  const totalCarbs = Math.round(recipe.carbs * servingsMultiplier);
  const totalFat = Math.round(recipe.fat * servingsMultiplier);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
        {/* Hero Image Banner */}
        <div className="recipe-hero-image-wrap">
          <img src={recipe.image} alt={recipe.name} className="recipe-hero-image" />
          <div className="recipe-image-overlay">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {(recipe.tags || [recipe.category]).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: 'rgba(20, 18, 16, 0.75)',
                      backdropFilter: 'blur(8px)',
                      color: '#F4C430',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {recipe.rating && (
                  <span
                    style={{
                      background: 'rgba(244, 196, 48, 0.2)',
                      border: '1px solid rgba(244, 196, 48, 0.4)',
                      color: '#F4C430',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: '999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Star size={12} fill="#F4C430" /> {recipe.rating}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleBookmark}
                  className="modal-close-btn"
                  style={{ background: 'rgba(20, 18, 16, 0.75)', borderRadius: '50%', width: '38px', height: '38px' }}
                  title={isSaved ? 'Remove Bookmark' : 'Save Recipe'}
                >
                  {isSaved ? <BookmarkCheck size={20} color="#F4C430" /> : <Bookmark size={20} color="#ffffff" />}
                </button>
                <button
                  type="button"
                  className="modal-close-btn"
                  style={{ background: 'rgba(20, 18, 16, 0.75)', borderRadius: '50%', width: '38px', height: '38px' }}
                  onClick={onClose}
                >
                  <X size={20} color="#ffffff" />
                </button>
              </div>
            </div>

            <div>
              <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: '2rem', fontWeight: 700, color: '#ffffff', lineHeight: '1.2', marginBottom: '6px' }}>
                {recipe.name}
              </h2>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#E5E0D8', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {recipe.prepTime} prep • {recipe.cookTime} cook
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={14} /> {recipe.servings || 2} servings
                </span>
                {recipe.author && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F4C430' }}>
                    <img
                      src={recipe.author.avatar}
                      alt={recipe.author.name}
                      style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    By {recipe.author.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="recipe-modal-content">
          {/* Servings Adjuster */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '12px 18px', borderRadius: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: '#C5BFB5' }}>Portion / Servings multiplier:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4].map((mult) => (
                <button
                  key={mult}
                  type="button"
                  onClick={() => setServingsMultiplier(mult)}
                  style={{
                    background: servingsMultiplier === mult ? '#F4C430' : 'rgba(255,255,255,0.06)',
                    color: servingsMultiplier === mult ? '#1A1817' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {mult}x
                </button>
              ))}
            </div>
          </div>

          {/* Macro Breakdown */}
          <div className="macro-preview-grid">
            <div className="macro-box">
              <div className="macro-box-val" style={{ color: '#F4C430' }}>{totalCalories}</div>
              <div className="macro-box-label">Calories (kcal)</div>
            </div>
            <div className="macro-box">
              <div className="macro-box-val" style={{ color: '#FF6347' }}>{totalProtein}g</div>
              <div className="macro-box-label">Protein</div>
            </div>
            <div className="macro-box">
              <div className="macro-box-val" style={{ color: '#7BB661' }}>{totalCarbs}g</div>
              <div className="macro-box-label">Carbs</div>
            </div>
            <div className="macro-box">
              <div className="macro-box-val" style={{ color: '#E5A812' }}>{totalFat}g</div>
              <div className="macro-box-label">Fat</div>
            </div>
          </div>

          {/* Description */}
          {recipe.description && (
            <p style={{ fontSize: '0.92rem', color: '#A39D93', lineHeight: '1.6', margin: 0 }}>
              {recipe.description}
            </p>
          )}

          {/* Ingredients Checklist */}
          <div>
            <h3 className="recipe-section-title">
              <ChefHat size={20} color="#F4C430" />
              <span>Ingredients ({recipe.ingredients?.length || 0})</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(recipe.ingredients || []).map((ing, idx) => {
                const checked = checkedIngredients[idx];
                const qty = (parseFloat(ing.quantity) * servingsMultiplier).toString();
                return (
                  <div
                    key={idx}
                    className="ingredient-checklist-item"
                    onClick={() => toggleIngredient(idx)}
                    style={{ textDecoration: checked ? 'line-through' : 'none', color: checked ? '#7E7870' : '#ffffff' }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checked}
                      onChange={() => {}}
                      style={{ accentColor: '#F4C430', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 600, color: checked ? '#7E7870' : '#F4C430' }}>
                      {qty} {ing.unit}
                    </span>
                    <span>{ing.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="recipe-section-title">
              <span>Cooking Instructions</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(recipe.instructions || []).map((step, idx) => {
                const completed = completedSteps[idx];
                return (
                  <div
                    key={idx}
                    className="instruction-step"
                    onClick={() => toggleStep(idx)}
                    style={{ opacity: completed ? 0.6 : 1 }}
                  >
                    <div
                      className="step-num-badge"
                      style={{
                        background: completed ? 'rgba(79, 121, 66, 0.3)' : 'rgba(244, 196, 48, 0.15)',
                        color: completed ? '#7BB661' : '#F4C430',
                      }}
                    >
                      {completed ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: completed ? '#8E887E' : '#ffffff', lineHeight: '1.5' }}>
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Community Reviews & Ratings Section */}
          <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 className="recipe-section-title" style={{ margin: 0 }}>
                <MessageSquare size={18} color="#F4C430" />
                <span>Community Reviews ({reviews.length})</span>
              </h3>
              {recipe.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#F4C430' }}>
                  <Star size={16} fill="#F4C430" />
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{recipe.rating}</span>
                  <span style={{ color: '#8C867E' }}>/ 5</span>
                </div>
              )}
            </div>

            {/* Submit Review Box */}
            <form onSubmit={handleSubmitReview} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: '#C5BFB5' }}>Your Rating:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <Star
                        size={18}
                        color="#F4C430"
                        fill={star <= newRating ? '#F4C430' : 'transparent'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Write a tip or feedback for the community..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={submittingReview || !newComment.trim()}
                  style={{
                    background: '#F4C430',
                    color: '#1A1817',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0 16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: !newComment.trim() ? 0.5 : 1,
                  }}
                >
                  <Send size={15} />
                  <span>Post</span>
                </button>
              </div>

              {reviewMsg && (
                <div style={{ color: '#7BB661', fontSize: '0.82rem', marginTop: '8px', fontWeight: 600 }}>
                  {reviewMsg}
                </div>
              )}
            </form>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviews.length === 0 ? (
                <div style={{ color: '#8C867E', fontSize: '0.85rem', textAlign: 'center', padding: '16px' }}>
                  No reviews yet. Be the first to cook and review this recipe!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
                          alt={rev.userName}
                          style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{rev.userName}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} size={12} fill="#F4C430" color="#F4C430" />
                        ))}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#C5BFB5', lineHeight: '1.4' }}>
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer with "Log as Meal" Button */}
        <div className="modal-footer">


          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleLogAsMeal}
            disabled={loggingAsMeal || loggedSuccess}
            style={{ minWidth: '180px', justifyContent: 'center' }}
          >
            {loggedSuccess ? (
              <>
                <CheckCircle2 size={18} color="#1A1817" />
                <span>Logged to Today!</span>
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                <span>{loggingAsMeal ? 'Logging...' : `Log as Meal (${totalCalories} kcal)`}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
