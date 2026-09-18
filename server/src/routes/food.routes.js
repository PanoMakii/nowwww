import { Router } from 'express';
import { searchFoods } from '../controllers/food.controller.js';

const router = Router();

router.get('/', searchFoods);

export default router;
