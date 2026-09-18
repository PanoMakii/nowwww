import assert from 'node:assert';
import { signup } from '../src/controllers/auth.controller.js';
import { searchFoods } from '../src/controllers/food.controller.js';
import { createMeal } from '../src/controllers/meal.controller.js';
import { analyzeMealPhoto } from '../src/controllers/ai.controller.js';
import { syncWearableActivity } from '../src/controllers/wearable.controller.js';
import { joinChallenge } from '../src/controllers/social.controller.js';
import { publishCommunityRecipe, addRecipeReview } from '../src/controllers/recipe.controller.js';

export async function runE2EJourneyTests() {
  console.log('  ▶ Running Full E2E User Journey Simulation...');

  // Step 1: User Onboarding & Registration
  console.log('    [E2E Step 1] New user registers and completes onboarding...');
  let regRes = {};
  const userEmail = `athlete_e2e_${Date.now()}@recip52.com`;
  await signup(
    { body: { email: userEmail, password: 'SecurePassword123!', firstName: 'Morgan', lastName: 'Taylor' } },
    {
      status(code) {
        regRes.statusCode = code;
        return this;
      },
      json(data) {
        regRes.body = data;
        return this;
      },
    },
    (e) => { if (e) throw e; }
  );
  assert.strictEqual(regRes.statusCode, 201);
  assert.ok(regRes.body.token, 'Must receive auth token upon signup');

  // Step 2: Query Foods & Log Breakfast
  console.log('    [E2E Step 2] User searches nutrition database and logs breakfast...');
  let foodSearchRes = {};
  await searchFoods(
    { query: { q: 'Egg' } },
    { json(d) { foodSearchRes = d; return this; } },
    (e) => { if (e) throw e; }
  );
  assert.ok(foodSearchRes.foods.length > 0);

  let breakfastRes = {};
  await createMeal(
    {
      body: {
        mealType: 'breakfast',
        title: 'Eggs & Avocado Toast',
        calories: 420,
        protein: 24,
        carbs: 32,
        fat: 18,
        items: ['2 Large Whole Eggs', '1 Slice Sourdough', '50g Avocado'],
      },
    },
    {
      status(code) {
        breakfastRes.statusCode = code;
        return this;
      },
      json(data) {
        breakfastRes.body = data;
        return this;
      },
    },
    (e) => { if (e) throw e; }
  );
  assert.strictEqual(breakfastRes.statusCode, 201);

  // Step 3: AI Meal Photo Scan & Log Lunch
  console.log('    [E2E Step 3] User scans lunch plate photo via AI and logs meal...');
  let aiScanRes = {};
  await analyzeMealPhoto(
    { body: { sampleId: 'chicken_sweet_potato' } },
    { json(d) { aiScanRes = d; return this; } },
    (e) => { if (e) throw e; }
  );
  assert.strictEqual(aiScanRes.success, true);
  assert.ok(aiScanRes.analysis.totalCalories > 0);

  let lunchRes = {};
  await createMeal(
    {
      body: {
        mealType: 'lunch',
        title: 'AI Scanned: Herb Chicken & Roasted Sweet Potato',
        calories: aiScanRes.analysis.totalCalories,
        protein: aiScanRes.analysis.totalProtein,
        carbs: aiScanRes.analysis.totalCarbs,
        fat: aiScanRes.analysis.totalFat,
        items: aiScanRes.analysis.items.map((i) => `${i.portionGrams}g ${i.name}`),
      },
    },
    {
      status(code) {
        lunchRes.statusCode = code;
        return this;
      },
      json(data) {
        lunchRes.body = data;
        return this;
      },
    },
    (e) => { if (e) throw e; }
  );
  assert.strictEqual(lunchRes.statusCode, 201);

  // Step 4: Sync Wearables & Dynamic Calorie Calibration
  console.log('    [E2E Step 4] User syncs Apple Health wearable (520 active kcal burn)...');
  let wearSyncRes = {};
  await syncWearableActivity(
    {},
    { json(d) { wearSyncRes = d; return this; } },
    (e) => { if (e) throw e; }
  );
  assert.strictEqual(wearSyncRes.success, true);
  assert.ok(wearSyncRes.adjustment.suggestedCalorieBonusKcal > 0);

  // Step 5: Join 30-Day Macro Challenge
  console.log('    [E2E Step 5] User enrolls in 30-Day Protein Power Surge challenge...');
  let challengeJoinRes = {};
  await joinChallenge(
    { params: { id: 'c1' } },
    { json(d) { challengeJoinRes = d; return this; } },
    (e) => { if (e) throw e; }
  );
  assert.strictEqual(challengeJoinRes.success, true);

  // Step 6: Publish Community Recipe & Receive Review
  console.log('    [E2E Step 6] User publishes a custom community recipe & submits review...');
  let publishRes = {};
  await publishCommunityRecipe(
    {
      body: {
        name: 'Crispy Garlic Sesame Edamame Stir-Fry',
        category: 'High-Protein',
        prepTime: '10 min',
        cookTime: '15 min',
        servings: 2,
        calories: 380,
        protein: 32,
        carbs: 24,
        fat: 14,
        ingredients: [{ quantity: '200', unit: 'g', name: 'Shelled Edamame' }],
        instructions: ['Heat sesame oil, toss edamame and minced garlic for 6 mins.'],
      },
    },
    {
      status(code) {
        publishRes.statusCode = code;
        return this;
      },
      json(data) {
        publishRes.body = data;
        return this;
      },
    },
    (e) => { if (e) throw e; }
  );
  assert.strictEqual(publishRes.statusCode, 201);
  const createdRecipeId = publishRes.body.recipe.id;

  let reviewRes = {};
  await addRecipeReview(
    {
      params: { id: createdRecipeId },
      body: { rating: 5, comment: 'Phenomenal plant protein and crunch!' },
    },
    {
      status(code) {
        reviewRes.statusCode = code;
        return this;
      },
      json(data) {
        reviewRes.body = data;
        return this;
      },
    },
    (e) => { if (e) throw e; }
  );
  assert.strictEqual(reviewRes.statusCode, 201);
  assert.strictEqual(reviewRes.body.averageRating, 5);

  console.log('  ✔ Complete End-to-End User Journey succeeded flawlessly!');
}

if (process.argv[1] && process.argv[1].endsWith('e2e-journey.test.js')) {
  runE2EJourneyTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
