import { Router } from 'express';
import { analyzeMealPhoto, generateMealPlan } from '../controllers/ai.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post('/analyze-photo', validate('analyzePhoto'), analyzeMealPhoto);
router.post('/generate-plan', validate('generatePlan'), generateMealPlan);

export default router;

