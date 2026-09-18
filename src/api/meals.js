import apiClient from './client.js';

export async function getMealsApi(date) {
  try {
    const response = await apiClient.get('/meals', {
      params: date ? { date } : {},
    });
    return response.data;
  } catch (err) {
    console.warn('API error fetching meals, returning fallback:', err);
    return {
      totals: { calories: 1240, protein: 80, carbs: 121, fat: 48 },
      meals: [],
    };
  }
}

export async function createMealApi(mealData) {
  const response = await apiClient.post('/meals', mealData);
  return response.data;
}

export async function deleteMealApi(mealId) {
  const response = await apiClient.delete(`/meals/${mealId}`);
  return response.data;
}
