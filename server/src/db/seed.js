import bcrypt from 'bcryptjs';
import { pool, checkConnection } from '../config/db.js';
import {
  FOOD_DATABASE,
  RECIPES_DATABASE,
  COMMUNITY_CREATORS,
  CHALLENGES_DATABASE,
  ACTIVITY_FEED,
} from '../data/mockData.js';

export async function runSeed() {
  console.log('🌱 Checking database connection for seeding...');

  const health = await checkConnection();
  if (!health.ok) {
    console.warn('⚠️  PostgreSQL is not reachable:', health.error);
    console.warn('⚡ Recip52 in-memory datasets are already pre-populated for offline demo.');
    return { status: 'offline_mock_ready' };
  }

  const client = await pool.connect();

  try {
    console.log('🌱 Starting comprehensive database seeding...');
    await client.query('BEGIN');

    const defaultPasswordHash = bcrypt.hashSync('Password123!', 10);

    // 1. Seed Users & Preferences
    console.log('👤 Seeding default users and creators...');
    const userMap = {};

    // Primary demo user
    const primaryUserRes = await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, avatar_url, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name
       RETURNING id, email`,
      [
        'alex@recip52.com',
        defaultPasswordHash,
        'Alex',
        'Johnson',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
        true,
      ]
    );
    userMap['user_current'] = primaryUserRes.rows[0].id;

    // Seed User Preferences
    await client.query(
      `INSERT INTO user_preferences (user_id, daily_calories, daily_protein_g, daily_carbs_g, daily_fat_g, daily_water_ml)
       VALUES ($1, 2200, 160.00, 220.00, 65.00, 3000)
       ON CONFLICT (user_id) DO NOTHING`,
      [primaryUserRes.rows[0].id]
    );

    // Seed Community Creators
    for (const creator of COMMUNITY_CREATORS) {
      const email = `${creator.id}@recip52.com`;
      const nameParts = creator.name.split(' ');
      const res = await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, avatar_url, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name
         RETURNING id, email`,
        [
          email,
          defaultPasswordHash,
          nameParts[0],
          nameParts.slice(1).join(' '),
          creator.avatar,
          true,
        ]
      );
      userMap[creator.id] = res.rows[0].id;
    }

    // 2. Seed Food Items
    console.log(`🍎 Seeding ${FOOD_DATABASE.length} staple food items...`);
    for (const food of FOOD_DATABASE) {
      await client.query(
        `INSERT INTO food_items (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [
          food.name,
          food.caloriesPer100g,
          food.protein,
          food.carbs,
          food.fat,
          food.fiber,
        ]
      );
    }

    // 3. Seed Recipes & Ingredients
    console.log(`🍲 Seeding ${RECIPES_DATABASE.length} curated & community recipes...`);
    for (const recipe of RECIPES_DATABASE) {
      const creatorId = recipe.author?.id ? userMap[recipe.author.id] : userMap['user_current'];
      const prepInt = parseInt(recipe.prepTime, 10) || 15;
      const cookInt = parseInt(recipe.cookTime, 10) || 20;

      const recRes = await client.query(
        `INSERT INTO recipes (name, description, instructions, prep_time_minutes, cook_time_minutes, servings, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, image_url, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        [
          recipe.name,
          recipe.description,
          JSON.stringify(recipe.instructions || []),
          prepInt,
          cookInt,
          recipe.servings || 2,
          recipe.calories,
          recipe.protein,
          recipe.carbs,
          recipe.fat,
          recipe.image,
          creatorId,
        ]
      );

      const newRecId = recRes.rows[0].id;

      // Seed Recipe Ingredients
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        for (const ing of recipe.ingredients) {
          await client.query(
            `INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit)
             VALUES ($1, $2, $3, $4)`,
            [newRecId, ing.name, parseFloat(ing.quantity) || 100, ing.unit || 'g']
          );
        }
      }
    }

    // 4. Seed 30-Day Challenges
    console.log(`🏆 Seeding ${CHALLENGES_DATABASE.length} macro challenges...`);
    for (const ch of CHALLENGES_DATABASE) {
      const chRes = await client.query(
        `INSERT INTO challenges (title, description, duration_days, target_metric, target_value, badge_name, banner_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          ch.title,
          ch.description,
          ch.durationDays,
          ch.targetMetric,
          135,
          ch.badgeName,
          ch.bannerUrl,
        ]
      );

      // Join primary user into active challenge
      if (ch.status === 'joined') {
        await client.query(
          `INSERT INTO challenge_participants (challenge_id, user_id, current_streak_days, progress_percent, points, status)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [chRes.rows[0].id, userMap['user_current'], ch.currentStreakDays, ch.progressPercent, ch.points, 'active']
        );
      }
    }

    // 5. Seed Wearable Devices & Activity Log
    console.log('⌚ Seeding wearable device connection and activity log...');
    await client.query(
      `INSERT INTO wearable_devices (user_id, device_type, is_active)
       VALUES ($1, 'apple_health', true)
       ON CONFLICT DO NOTHING`,
      [userMap['user_current']]
    );

    await client.query(
      `INSERT INTO activity_logs (user_id, date, steps, calories_burned, heart_rate_avg, sleep_minutes)
       VALUES ($1, CURRENT_DATE, 8420, 520.00, 62, 465)
       ON CONFLICT DO NOTHING`,
      [userMap['user_current']]
    );

    await client.query('COMMIT');
    console.log('✅ Comprehensive database seeding completed successfully!');
    return { status: 'seeded_successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Allow direct CLI execution
const __filename = new URL(import.meta.url).pathname;
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSeed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
