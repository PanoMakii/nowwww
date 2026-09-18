import { Router } from 'express';
import { getMeals, createMeal, deleteMeal } from '../controllers/meal.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/', getMeals);
router.post('/', validate('createMeal'), createMeal);
router.delete('/:id', deleteMeal);

export default router;

