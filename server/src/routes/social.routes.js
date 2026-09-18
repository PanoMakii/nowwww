import { Router } from 'express';
import {
  getSocialFeed,
  cheerActivity,
  getChallenges,
  joinChallenge,
  getLeaderboard,
  getPublicProfile,
  toggleFollowUser,
  getSuggestedChefs,
} from '../controllers/social.controller.js';

const router = Router();

// Activity Feed & Engagement
router.get('/feed', getSocialFeed);
router.post('/feed/:id/cheer', cheerActivity);

// 30-Day Macro Challenges & Leaderboards
router.get('/challenges', getChallenges);
router.post('/challenges/:id/join', joinChallenge);
router.get('/challenges/:id/leaderboard', getLeaderboard);

// Public User & Chef Profiles
router.get('/profile/:id', getPublicProfile);
router.post('/follow/:id', toggleFollowUser);
router.get('/suggested-chefs', getSuggestedChefs);

export default router;
