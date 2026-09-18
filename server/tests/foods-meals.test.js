import assert from 'node:assert';
import { searchFoods } from '../src/controllers/food.controller.js';
import { getMeals, createMeal, deleteMeal } from '../src/controllers/meal.controller.js';

export async function runFoodsMealsTests() {

  console.log('  ▶ Testing Foods & Meals Controllers...');

  // 1. Food Database Search
  let foodsResponse = {};
  const mockFoodReq = { query: { q: 'salmon', category: '' } };
  const mockFoodRes = {
    json(data) {
      foodsResponse = data;
      return this;
    },
  };

  await searchFoods(mockFoodReq, mockFoodRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(foodsResponse.success, true);
  assert.ok(Array.isArray(foodsResponse.foods), 'Foods response should be an array');
  assert.ok(foodsResponse.foods.length > 0, 'Should return at least one salmon item');
  assert.ok(
    foodsResponse.foods.some((f) => f.name.toLowerCase().includes('salmon')),
    'Found food item should contain salmon'
  );

  // 2. Create Meal
  let createdMealResponse = {};
  const mockMealReq = {
    body: {
      mealType: 'breakfast',
      title: 'Power Protein Oats & Greek Yogurt',
      calories: 450,
      protein: 38,
      carbs: 45,
      fat: 10,
      items: ['Rolled Oats (60g)', 'Greek Yogurt (150g)', 'Blueberries (50g)'],
    },
  };
  const mockMealRes = {
    status(code) {
      createdMealResponse.statusCode = code;
      return this;
    },
    json(data) {
      createdMealResponse.body = data;
      return this;
    },
  };

  await createMeal(mockMealReq, mockMealRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(createdMealResponse.statusCode, 201);
  assert.strictEqual(createdMealResponse.body.success, true);
  const createdId = createdMealResponse.body.meal.id;
  assert.ok(createdId, 'Created meal should have an ID');
  assert.strictEqual(createdMealResponse.body.meal.calories, 450);

  // 3. List Meals
  let listMealsResponse = {};
  const mockListReq = { query: {} };
  const mockListRes = {
    json(data) {
      listMealsResponse = data;
      return this;
    },
  };

  await getMeals(mockListReq, mockListRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(listMealsResponse.success, true);
  assert.ok(Array.isArray(listMealsResponse.meals));
  assert.ok(
    listMealsResponse.meals.some((m) => m.id === createdId),
    'Newly created meal should be in meals list'
  );

  // 4. Daily Totals
  assert.ok(listMealsResponse.totals, 'Daily totals object should be returned');
  assert.ok(listMealsResponse.totals.calories > 0, 'Total calories should be positive');


  // 5. Delete Meal
  let deleteResponse = {};
  const mockDeleteReq = { params: { id: createdId } };
  const mockDeleteRes = {
    json(data) {
      deleteResponse = data;
      return this;
    },
  };

  await deleteMeal(mockDeleteReq, mockDeleteRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(deleteResponse.success, true);
  assert.strictEqual(deleteResponse.deletedId, createdId);

  console.log('  ✔ Foods & Meals tests passed successfully.');
}

if (process.argv[1] && process.argv[1].endsWith('foods-meals.test.js')) {
  runFoodsMealsTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
