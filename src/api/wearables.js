import apiClient from './client.js';

export async function getWearablesApi() {
  const response = await apiClient.get('/wearables');
  return response.data;
}

export async function connectWearableApi(deviceType) {
  const response = await apiClient.post('/wearables/connect', { deviceType });
  return response.data;
}

export async function syncWearablesApi() {
  const response = await apiClient.post('/wearables/sync');
  return response.data;
}

export async function disconnectWearableApi(id) {
  const response = await apiClient.delete(`/wearables/${id}`);
  return response.data;
}
