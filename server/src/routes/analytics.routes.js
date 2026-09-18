import { Router } from 'express';
import {
  getNutritionalInsights,
  getDailyAnalytics,
  getWeeklyAnalytics,
} from '../controllers/analytics.controller.js';

const router = Router();

router.get('/insights', getNutritionalInsights);
router.get('/daily', getDailyAnalytics);
router.get('/weekly', getWeeklyAnalytics);

export default router;
