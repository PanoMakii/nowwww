import apiClient from './client.js';

export async function getRecipesApi(filters = {}) {
  try {
    const response = await apiClient.get('/recipes', { params: filters });
    return response.data.recipes || [];
  } catch (err) {
    console.warn('API error fetching recipes, returning fallback:', err);
    return [];
  }
}

export async function getRecipeByIdApi(id) {
  const response = await apiClient.get(`/recipes/${id}`);
  return response.data.recipe;
}

export async function toggleSaveRecipeApi(id) {
  const response = await apiClient.post(`/recipes/${id}/save`);
  return response.data;
}

export async function publishRecipeApi(recipeData) {
  const response = await apiClient.post('/recipes/publish', recipeData);
  return response.data;
}

export async function getRecipeReviewsApi(recipeId) {
  const response = await apiClient.get(`/recipes/${recipeId}/reviews`);
  return response.data.reviews || [];
}

export async function addRecipeReviewApi(recipeId, reviewData) {
  const response = await apiClient.post(`/recipes/${recipeId}/reviews`, reviewData);
  return response.data;
}

