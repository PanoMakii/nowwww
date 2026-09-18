import apiClient from './client.js';

export async function analyzePhotoApi({ imageBase64, imageUrl }) {
  const response = await apiClient.post('/ai/analyze-photo', {
    imageBase64,
    imageUrl,
  });
  return response.data;
}

export async function generatePlanApi(options = {}) {
  const response = await apiClient.post('/ai/generate-plan', options);
  return response.data;
}
