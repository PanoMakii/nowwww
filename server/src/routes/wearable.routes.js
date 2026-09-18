import { Router } from 'express';
import {
  getWearables,
  connectWearable,
  syncWearableActivity,
  disconnectWearable,
} from '../controllers/wearable.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/', getWearables);
router.post('/connect', validate('connectWearable'), connectWearable);
router.post('/sync', syncWearableActivity);
router.delete('/:id', disconnectWearable);

export default router;

