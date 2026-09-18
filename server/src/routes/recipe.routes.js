import { Router } from 'express';
import {
  getRecipes,
  getRecipeById,
  toggleSaveRecipe,
  getSavedRecipes,
  publishCommunityRecipe,
  getRecipeReviews,
  addRecipeReview,
} from '../controllers/recipe.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/', getRecipes);
router.get('/saved', getSavedRecipes);
router.post('/publish', validate('publishRecipe'), publishCommunityRecipe);
router.get('/:id', getRecipeById);
router.post('/:id/save', toggleSaveRecipe);
router.get('/:id/reviews', getRecipeReviews);
router.post('/:id/reviews', validate('recipeReview'), addRecipeReview);

export default router;


