import { runAuthTests } from './auth.test.js';
import { runFoodsMealsTests } from './foods-meals.test.js';
import { runRecipesTests } from './recipes.test.js';
import { runAiWearablesTests } from './ai-wearables.test.js';
import { runSocialTests } from './social.test.js';
import { runE2EJourneyTests } from './e2e-journey.test.js';

async function main() {
  console.log('\n========================================================');
  console.log('🧪 RECIP52 COMPREHENSIVE AUTOMATED TEST HARNESS');
  console.log('========================================================\n');

  const startTime = Date.now();
  const suites = [
    { name: 'Authentication & Validation Suite', fn: runAuthTests },
    { name: 'Food Database & Meals Management Suite', fn: runFoodsMealsTests },
    { name: 'Recipe Catalog & Community Publishing Suite', fn: runRecipesTests },
    { name: 'AI Vision & Wearables Telemetry Suite', fn: runAiWearablesTests },
    { name: 'Social Feed & 30-Day Challenges Suite', fn: runSocialTests },
    { name: 'Complete End-to-End User Simulation Suite', fn: runE2EJourneyTests },
  ];

  let passedSuites = 0;
  let failedSuites = 0;

  for (const suite of suites) {
    console.log(`\n📦 Running: ${suite.name}`);
    try {
      await suite.fn();
      passedSuites++;
    } catch (err) {
      console.error(`❌ FAILED: ${suite.name}`);
      console.error(err);
      failedSuites++;
    }
  }

  const durationMs = Date.now() - startTime;

  console.log('\n========================================================');
  console.log('📊 TEST EXECUTION RESULTS');
  console.log('========================================================');
  console.log(`Total Suites Run : ${suites.length}`);
  console.log(`Suites Passed    : ${passedSuites} ✅`);
  console.log(`Suites Failed    : ${failedSuites} ${failedSuites > 0 ? '❌' : ''}`);
  console.log(`Execution Time   : ${durationMs}ms`);
  console.log('========================================================\n');

  if (failedSuites > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL TEST SUITES PASSED WITH 100% SUCCESS RATE!\n');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
