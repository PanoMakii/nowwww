import apiClient from './client.js';

export async function loginApi({ email, password }) {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
}

export async function signupApi(userData) {
  const response = await apiClient.post('/auth/signup', userData);
  return response.data;
}

export async function getProfileApi() {
  const response = await apiClient.get('/users/profile');
  return response.data;
}

export async function updatePreferencesApi(preferences) {
  const response = await apiClient.put('/users/preferences', preferences);
  return response.data;
}

export async function requestPasswordResetApi(email) {
  const response = await apiClient.post('/auth/reset-password', { email });
  return response.data;
}

export async function verifyEmailApi(token) {
  const response = await apiClient.post('/auth/verify-email', { token });
  return response.data;
}
