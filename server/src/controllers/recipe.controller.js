import { RECIPES_DATABASE, RECIPE_REVIEWS, ACTIVITY_FEED } from '../data/mockData.js';
import { pool } from '../config/db.js';

let savedRecipeIds = new Set(['r2']);
let recipeReviewsState = [...RECIPE_REVIEWS];

export async function getRecipes(req, res, next) {
  try {
    const { category, search, maxCalories } = req.query;

    let results = RECIPES_DATABASE.map((r) => ({
      ...r,
      saved: savedRecipeIds.has(r.id),
    }));

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All') {
      results = results.filter(
        (r) => r.category === category || r.tags.includes(category)
      );
    }

    if (maxCalories) {
      results = results.filter((r) => r.calories <= parseInt(maxCalories, 10));
    }

    res.json({
      success: true,
      count: results.length,
      recipes: results,
    });
  } catch (err) {
    next(err);
  }
}

export async function getRecipeById(req, res, next) {
  try {
    const { id } = req.params;
    const recipe = RECIPES_DATABASE.find((r) => r.id === id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    const reviews = recipeReviewsState.filter((rev) => rev.recipeId === id);

    res.json({
      success: true,
      recipe: {
        ...recipe,
        saved: savedRecipeIds.has(recipe.id),
        reviews,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleSaveRecipe(req, res, next) {
  try {
    const { id } = req.params;
    const recipe = RECIPES_DATABASE.find((r) => r.id === id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    let isSaved = false;
    if (savedRecipeIds.has(id)) {
      savedRecipeIds.delete(id);
      isSaved = false;
    } else {
      savedRecipeIds.add(id);
      isSaved = true;
    }

    res.json({
      success: true,
      recipeId: id,
      saved: isSaved,
      message: isSaved ? 'Recipe bookmarked' : 'Recipe bookmark removed',
    });
  } catch (err) {
    next(err);
  }
}

export async function getSavedRecipes(req, res, next) {
  try {
    const savedList = RECIPES_DATABASE.filter((r) => savedRecipeIds.has(r.id)).map(
      (r) => ({ ...r, saved: true })
    );

    res.json({
      success: true,
      count: savedList.length,
      recipes: savedList,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/recipes/publish
 * Publish a new community recipe
 */
export async function publishCommunityRecipe(req, res, next) {
  try {
    const {
      name,
      description,
      category = 'High-Protein',
      prepTime = '15 min',
      cookTime = '20 min',
      servings = 2,
      calories = 450,
      protein = 35,
      carbs = 40,
      fat = 15,
      image,
      tags = [],
      ingredients = [],
      instructions = [],
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Recipe name is required' });
    }

    const newRecipe = {
      id: `r_comm_${Date.now()}`,
      name,
      category,
      description: description || 'A wholesome community recipe crafted for high nutritional impact.',
      prepTime,
      cookTime,
      servings: Number(servings) || 2,
      calories: Number(calories) || 450,
      protein: Number(protein) || 35,
      carbs: Number(carbs) || 40,
      fat: Number(fat) || 15,
      image: image || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
      tags: Array.isArray(tags) && tags.length > 0 ? tags : [category, 'Community'],
      saved: false,
      rating: 5.0,
      reviewCount: 1,
      author: {
        id: 'user_current',
        name: 'Alex Johnson (You)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
        badge: 'Community Chef',
      },
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      instructions: Array.isArray(instructions) ? instructions : [],
    };

    // Prepend to recipes list
    RECIPES_DATABASE.unshift(newRecipe);

    // Also broadcast to activity feed
    ACTIVITY_FEED.unshift({
      id: `act_${Date.now()}`,
      user: newRecipe.author,
      action: 'published_recipe',
      title: `published a new community recipe: ${newRecipe.name}`,
      timeAgo: 'Just now',
      likesCount: 1,
      isCheered: false,
      recipeId: newRecipe.id,
    });

    res.status(201).json({
      success: true,
      message: 'Recipe published to community successfully!',
      recipe: newRecipe,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/recipes/:id/reviews
 * Fetch reviews for a specific recipe
 */
export async function getRecipeReviews(req, res, next) {
  try {
    const { id } = req.params;
    const reviews = recipeReviewsState.filter((r) => r.recipeId === id);

    res.json({
      success: true,
      recipeId: id,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/recipes/:id/reviews
 * Submit a rating and review for a recipe
 */
export async function addRecipeReview(req, res, next) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const recipe = RECIPES_DATABASE.find((r) => r.id === id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const ratingVal = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));

    const newReview = {
      id: `rev_${Date.now()}`,
      recipeId: id,
      userId: 'user_current',
      userName: 'Alex Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      rating: ratingVal,
      comment: comment || 'Loved cooking this recipe, great macro balance!',
      createdAt: new Date().toISOString(),
    };

    recipeReviewsState.unshift(newReview);

    // Update recipe average rating and review count
    const allForThis = recipeReviewsState.filter((r) => r.recipeId === id);
    const avgRating = (
      allForThis.reduce((acc, curr) => acc + curr.rating, 0) / allForThis.length
    ).toFixed(1);

    recipe.rating = parseFloat(avgRating);
    recipe.reviewCount = allForThis.length;

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: newReview,
      averageRating: recipe.rating,
      totalReviews: recipe.reviewCount,
    });
  } catch (err) {
    next(err);
  }
}

