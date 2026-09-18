import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import foodRoutes from './food.routes.js';
import mealRoutes from './meal.routes.js';
import recipeRoutes from './recipe.routes.js';
import aiRoutes from './ai.routes.js';
import analyticsRoutes from './analytics.routes.js';
import wearableRoutes from './wearable.routes.js';
import socialRoutes from './social.routes.js';
import docsRoutes from './docs.routes.js';

const apiRouter = Router();

// Route mounts
apiRouter.use('/health', healthRoutes);
apiRouter.use('/docs', docsRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/foods', foodRoutes);
apiRouter.use('/meals', mealRoutes);
apiRouter.use('/recipes', recipeRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/wearables', wearableRoutes);
apiRouter.use('/social', socialRoutes);

// Welcome root manifest
apiRouter.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Recip52 API',
    version: '1.0.0',
    documentation: {
      interactiveUi: '/api/docs',
      openapiJson: '/api/docs/openapi.json',
    },
    endpoints: {
      docs: '/api/docs',
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      foods: '/api/foods',
      meals: '/api/meals',
      recipes: '/api/recipes',
      wearables: '/api/wearables',
      social: '/api/social',
      ai: {
        analyzePhoto: 'POST /api/ai/analyze-photo',
        generatePlan: 'POST /api/ai/generate-plan',
      },
      analytics: {
        insights: 'GET /api/analytics/insights',
        daily: 'GET /api/analytics/daily',
        weekly: 'GET /api/analytics/weekly',
      },
    },
  });
});

export default apiRouter;


