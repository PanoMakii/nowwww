import assert from 'node:assert';
import { analyzeMealPhoto, generateMealPlan } from '../src/controllers/ai.controller.js';
import { getWearables, syncWearableActivity } from '../src/controllers/wearable.controller.js';

export async function runAiWearablesTests() {
  console.log('  ▶ Testing AI Engine & Wearable Telemetry Controllers...');

  // 1. AI Photo Analysis
  let photoRes = {};
  const mockPhotoReq = { body: { sampleId: 'salmon_bowl' } };
  const mockPhotoRes = {
    json(data) {
      photoRes = data;
      return this;
    },
  };

  await analyzeMealPhoto(mockPhotoReq, mockPhotoRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(photoRes.success, true);
  assert.ok(photoRes.analysis, 'Analysis object must be present');
  assert.ok(photoRes.analysis.items.length > 0, 'Must segment food items from plate');
  assert.ok(photoRes.analysis.totalCalories > 0, 'Total calories must be computed');
  assert.ok(photoRes.analysis.totalProtein > 0, 'Protein must be computed');
  assert.ok(
    photoRes.analysis.items.every((i) => i.confidence >= 0.7),
    'Confidence scores should be high (>70%)'
  );

  // 2. AI 7-Day Meal Plan Generator
  let planRes = {};
  const mockPlanReq = {
    body: {
      targetCalories: 2300,
      targetProtein: 165,
      goal: 'Muscle Gain',
    },
  };
  const mockPlanRes = {
    json(data) {
      planRes = data;
      return this;
    },
  };

  await generateMealPlan(mockPlanReq, mockPlanRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(planRes.success, true);
  assert.ok(planRes.plan, 'Plan object must be returned');
  assert.strictEqual(planRes.plan.days.length, 7, 'Must generate full 7 days');
  assert.ok(
    planRes.plan.days[0].meals.length >= 3,
    'Each day should contain at least 3 meals (breakfast, lunch, dinner)'
  );
  assert.ok(planRes.plan.groceryList.length >= 3, 'Must categorize grocery items into aisles');

  // 3. Wearables Registry & Telemetry
  let wearRes = {};
  const mockWearReq = {};
  const mockWearRes = {
    json(data) {
      wearRes = data;
      return this;
    },
  };

  await getWearables(mockWearReq, mockWearRes, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(wearRes.success, true);
  assert.ok(wearRes.devices.length >= 4, 'Should support Apple Health, Fitbit, Garmin, Whoop');
  assert.ok(wearRes.telemetry, 'Current telemetry should be populated');
  assert.strictEqual(typeof wearRes.telemetry.steps, 'number');
  assert.strictEqual(typeof wearRes.telemetry.activeBurnKcal, 'number');

  // 4. Wearable Biometric Sync & Goal Adjustment
  let syncRes = {};
  await syncWearableActivity(mockWearReq, mockWearRes, (err) => {
    if (err) throw err;
  });
  syncRes = wearRes;

  assert.strictEqual(syncRes.success, true);
  assert.ok(syncRes.adjustment, 'Dynamic nutrition calibration adjustment must be present');
  assert.ok(syncRes.adjustment.suggestedCalorieBonusKcal >= 0);
  assert.ok(syncRes.adjustment.suggestedHydrationBonusMl >= 0);

  console.log('  ✔ AI Engine & Wearable Telemetry tests passed successfully.');
}

if (process.argv[1] && process.argv[1].endsWith('ai-wearables.test.js')) {
  runAiWearablesTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
