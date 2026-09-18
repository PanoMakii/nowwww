import { Router } from 'express';
import { getProfile, updatePreferences } from '../controllers/user.controller.js';

const router = Router();

router.get('/profile', getProfile);
router.put('/profile', updatePreferences);
router.put('/preferences', updatePreferences);

export default router;
