import apiClient from './client.js';

export async function getSocialFeedApi() {
  try {
    const response = await apiClient.get('/social/feed');
    return response.data.feed || [];
  } catch (err) {
    console.warn('Error fetching social feed:', err);
    return [];
  }
}

export async function cheerActivityApi(activityId) {
  const response = await apiClient.post(`/social/feed/${activityId}/cheer`);
  return response.data;
}

export async function getChallengesApi() {
  try {
    const response = await apiClient.get('/social/challenges');
    return response.data.challenges || [];
  } catch (err) {
    console.warn('Error fetching challenges:', err);
    return [];
  }
}

export async function joinChallengeApi(challengeId) {
  const response = await apiClient.post(`/social/challenges/${challengeId}/join`);
  return response.data;
}

export async function getLeaderboardApi(challengeId = 'c1') {
  try {
    const response = await apiClient.get(`/social/challenges/${challengeId}/leaderboard`);
    return response.data.leaderboard || [];
  } catch (err) {
    console.warn('Error fetching leaderboard:', err);
    return [];
  }
}

export async function getPublicProfileApi(userId) {
  const response = await apiClient.get(`/social/profile/${userId}`);
  return response.data.profile;
}

export async function toggleFollowChefApi(userId) {
  const response = await apiClient.post(`/social/follow/${userId}`);
  return response.data;
}

export async function getSuggestedChefsApi() {
  try {
    const response = await apiClient.get('/social/suggested-chefs');
    return response.data.creators || [];
  } catch (err) {
    console.warn('Error fetching suggested chefs:', err);
    return [];
  }
}
