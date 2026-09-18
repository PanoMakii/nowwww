import apiClient from './client.js';

export async function searchFoodsApi(query = '', category = '') {
  try {
    const response = await apiClient.get('/foods', {
      params: { q: query, category },
    });
    return response.data.foods || [];
  } catch (err) {
    console.warn('API error searching foods, returning fallback list:', err);
    return [];
  }
}
