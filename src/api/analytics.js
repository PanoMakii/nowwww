import apiClient from './client.js';

export async function getNutritionalInsightsApi() {
  const response = await apiClient.get('/analytics/insights');
  return response.data.insights;
}

export async function getWeeklyAnalyticsApi() {
  const response = await apiClient.get('/analytics/weekly');
  return response.data.days;
}
