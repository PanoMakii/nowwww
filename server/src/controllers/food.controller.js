import { FOOD_DATABASE } from '../data/mockData.js';
import { pool } from '../config/db.js';

export async function searchFoods(req, res, next) {
  try {
    const queryStr = (req.query.q || '').trim().toLowerCase();
    const category = (req.query.category || '').trim().toLowerCase();
    const limit = parseInt(req.query.limit || '20', 10);

    // Attempt PostgreSQL query if available
    try {
      const dbResult = await pool.query(
        `SELECT id, name, brand, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g 
         FROM food_items 
         WHERE ($1 = '' OR LOWER(name) LIKE $2)
         LIMIT $3`,
        [queryStr, `%${queryStr}%`, limit]
      );
      if (dbResult.rows.length > 0) {
        return res.json({
          success: true,
          count: dbResult.rows.length,
          foods: dbResult.rows.map((r) => ({
            id: r.id,
            name: r.name,
            brand: r.brand,
            caloriesPer100g: parseFloat(r.calories_per_100g),
            protein: parseFloat(r.protein_per_100g),
            carbs: parseFloat(r.carbs_per_100g),
            fat: parseFloat(r.fat_per_100g),
            fiber: parseFloat(r.fiber_per_100g),
          })),
        });
      }
    } catch (dbErr) {
      // Graceful fallback to mock data when database is offline
    }

    // Filter in-memory dataset
    let results = FOOD_DATABASE;
    if (queryStr) {
      results = results.filter((f) =>
        f.name.toLowerCase().includes(queryStr) ||
        (f.category && f.category.toLowerCase().includes(queryStr))
      );
    }
    if (category) {
      results = results.filter((f) => f.category?.toLowerCase() === category);
    }

    res.json({
      success: true,
      count: results.slice(0, limit).length,
      foods: results.slice(0, limit),
    });
  } catch (err) {
    next(err);
  }
}
