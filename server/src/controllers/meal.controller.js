import { pool } from '../config/db.js';

// Fallback in-memory store for dev/testing when DB is offline
let inMemoryMeals = [
  {
    id: 'm1',
    userId: 'demo-user-001',
    title: 'Greek Yogurt Bowl with Berries & Chia',
    mealType: 'breakfast',
    calories: 380,
    protein: 28,
    carbs: 45,
    fat: 8,
    loggedAt: new Date().toISOString(),
    items: ['Greek Yogurt (200g)', 'Fresh Blueberries (50g)', 'Chia Seeds (15g)'],
  },
  {
    id: 'm2',
    userId: 'demo-user-001',
    title: 'Grilled Salmon & Quinoa Bowl',
    mealType: 'lunch',
    calories: 640,
    protein: 46,
    carbs: 52,
    fat: 26,
    loggedAt: new Date().toISOString(),
    items: ['Atlantic Salmon (180g)', 'Cooked Quinoa (150g)', 'Broccoli (100g)'],
  },
  {
    id: 'm3',
    userId: 'demo-user-001',
    title: 'Raw Almonds & Green Apple',
    mealType: 'snack',
    calories: 220,
    protein: 6,
    carbs: 24,
    fat: 14,
    loggedAt: new Date().toISOString(),
    items: ['Raw Almonds (30g)', 'Medium Apple (1)'],
  },
];

export async function getMeals(req, res, next) {
  try {
    const userId = req.user?.id || 'demo-user-001';
    const dateParam = req.query.date || new Date().toISOString().split('T')[0];

    // Try PostgreSQL
    try {
      const dbResult = await pool.query(
        `SELECT m.id, m.meal_type, m.logged_at, m.notes,
                COALESCE(SUM(mi.calories), 0) AS total_calories,
                COALESCE(SUM(mi.protein_g), 0) AS total_protein,
                COALESCE(SUM(mi.carbs_g), 0) AS total_carbs,
                COALESCE(SUM(mi.fat_g), 0) AS total_fat,
                json_agg(
                  json_build_object(
                    'id', mi.id,
                    'name', mi.custom_name,
                    'servingSizeG', mi.serving_size_g,
                    'calories', mi.calories,
                    'protein', mi.protein_g,
                    'carbs', mi.carbs_g,
                    'fat', mi.fat_g
                  )
                ) FILTER (WHERE mi.id IS NOT NULL) AS items
         FROM meals m
         LEFT JOIN meal_items mi ON m.id = mi.meal_id
         WHERE m.user_id = $1 AND DATE(m.logged_at) = $2
         GROUP BY m.id
         ORDER BY m.logged_at DESC`,
        [userId, dateParam]
      );

      if (dbResult.rows.length > 0) {
        return res.json({
          success: true,
          date: dateParam,
          meals: dbResult.rows,
        });
      }
    } catch (dbErr) {
      // Fallback to inMemoryMeals
    }

    // In-memory fallback
    const filtered = inMemoryMeals.filter((m) => {
      const mealDate = new Date(m.loggedAt).toISOString().split('T')[0];
      return mealDate === dateParam || !req.query.date;
    });

    const totals = filtered.reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    res.json({
      success: true,
      date: dateParam,
      totals,
      meals: filtered,
    });
  } catch (err) {
    next(err);
  }
}

export async function createMeal(req, res, next) {
  try {
    const userId = req.user?.id || 'demo-user-001';
    const { title, mealType, calories, protein, carbs, fat, items } = req.body;

    if (!mealType || !calories) {
      return res.status(400).json({
        success: false,
        message: 'mealType and calories are required',
      });
    }

    const newMeal = {
      id: `meal-${Date.now()}`,
      userId,
      title: title || `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Meal`,
      mealType,
      calories: parseFloat(calories),
      protein: parseFloat(protein || 0),
      carbs: parseFloat(carbs || 0),
      fat: parseFloat(fat || 0),
      loggedAt: new Date().toISOString(),
      items: Array.isArray(items) ? items : [title || 'Standard Portion'],
    };

    // Try PostgreSQL
    try {
      const insertResult = await pool.query(
        `INSERT INTO meals (user_id, meal_type, notes)
         VALUES ($1, $2, $3)
         RETURNING id, meal_type, logged_at`,
        [userId, mealType, title]
      );
      const createdMealId = insertResult.rows[0].id;
      newMeal.id = createdMealId;

      // Insert primary meal item
      await pool.query(
        `INSERT INTO meal_items (meal_id, custom_name, serving_size_g, calories, protein_g, carbs_g, fat_g)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [createdMealId, title, 100, calories, protein || 0, carbs || 0, fat || 0]
      );
    } catch (dbErr) {
      // PostgreSQL is offline, keep inMemory
    }

    inMemoryMeals.unshift(newMeal);

    res.status(201).json({
      success: true,
      message: 'Meal logged successfully',
      meal: newMeal,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteMeal(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'demo-user-001';

    try {
      await pool.query('DELETE FROM meals WHERE id = $1 AND user_id = $2', [id, userId]);
    } catch (dbErr) {
      // Keep going
    }

    inMemoryMeals = inMemoryMeals.filter((m) => m.id !== id);

    res.json({
      success: true,
      message: 'Meal deleted successfully',
      id,
      deletedId: id,
    });
  } catch (err) {
    next(err);
  }
}
