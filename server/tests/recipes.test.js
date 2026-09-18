import assert from 'node:assert';
import {
  getRecipes,
  getRecipeById,
  toggleSaveRecipe,
  publishCommunityRecipe,
  getRecipeReviews,
  addRecipeReview,
} from '../src/controllers/recipe.controller.js';

export async function runRecipesTests() {
  console.log('  ▶ Testing Recipe & Community Publishing Controllers...');

  // 1. List Recipes & Category Filter
  let recipesRes = {};
  const mockGetReq = { query: { category: 'High-Protein' } };
  const mockGetRes = {
    json(data) {
      recipesRes = data;
      return this;
    },
  };

  await getRecipes(mockGetReq, mockGetRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(recipesRes.success, true);
  assert.ok(recipesRes.recipes.length > 0);
  assert.ok(
    recipesRes.recipes.every((r) => r.category === 'High-Protein' || r.tags.includes('High-Protein')),
    'All returned recipes should match category'
  );

  // 2. Recipe Detail
  let detailRes = {};
  const targetId = recipesRes.recipes[0].id;
  const mockDetailReq = { params: { id: targetId } };
  const mockDetailRes = {
    json(data) {
      detailRes = data;
      return this;
    },
  };

  await getRecipeById(mockDetailReq, mockDetailRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(detailRes.success, true);
  assert.strictEqual(detailRes.recipe.id, targetId);
  assert.ok(detailRes.recipe.ingredients.length > 0, 'Recipe should have ingredients');

  // 3. Toggle Save / Bookmark
  let bookmarkRes = {};
  const mockSaveReq = { params: { id: targetId } };
  const mockSaveRes = {
    json(data) {
      bookmarkRes = data;
      return this;
    },
  };

  await toggleSaveRecipe(mockSaveReq, mockSaveRes, (err) => {
    if (err) throw err;
  });
  assert.strictEqual(bookmarkRes.success, true);
  assert.strictEqual(bookmarkRes.recipeId, targetId);

  // 4. Publish Community Recipe
  let publishRes = {};
  const mockPublishReq = {
    body: {
      name: 'Gourmet Lemon Herb Cod Fillet',
      description: 'Flaky Atlantic cod pan-seared with fresh oregano and capers.',
      category: 'High-Protein',
      prepTime: '10 min',
      cookTime: '12 min',
      servings: 2,
      calories: 340,
      protein: 36,
      carbs: 6,
      fat: 14,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
      tags: ['High-Protein', 'Pescatarian'],
      ingredients: [{ quantity: '300', unit: 'g', name: 'Fresh Cod Fillet' }],
      instructions: ['Pat cod dry and sear 4 minutes each side.'],
    },
  };
  const mockPublishRes = {
    status(code) {
      publishRes.statusCode = code;
      return this;
    },
    json(data) {
      publishRes.body = data;
      return this;
    },
  };

  await publishCommunityRecipe(mockPublishReq, mockPublishRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(publishRes.statusCode, 201);
  assert.strictEqual(publishRes.body.success, true);
  assert.ok(publishRes.body.recipe.id.startsWith('r_comm_'));
  assert.strictEqual(publishRes.body.recipe.calories, 340);

  // 5. Submit Review & Verify Average Rating
  let reviewSubmitRes = {};
  const mockReviewReq = {
    params: { id: targetId },
    body: {
      rating: 5,
      comment: 'Exceptional texture and macro profile. 10/10 recommended for meal prep.',
    },
  };
  const mockReviewRes = {
    status(code) {
      reviewSubmitRes.statusCode = code;
      return this;
    },
    json(data) {
      reviewSubmitRes.body = data;
      return this;
    },
  };

  await addRecipeReview(mockReviewReq, mockReviewRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(reviewSubmitRes.statusCode, 201);
  assert.strictEqual(reviewSubmitRes.body.success, true);
  assert.ok(reviewSubmitRes.body.review.id.startsWith('rev_'));
  assert.strictEqual(reviewSubmitRes.body.review.rating, 5);

  console.log('  ✔ Recipe & Community Publishing tests passed successfully.');
}

if (process.argv[1] && process.argv[1].endsWith('recipes.test.js')) {
  runRecipesTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
