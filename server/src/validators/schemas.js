/**
 * Declarative Validation Rules for Recip52 API
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const schemas = {
  // Auth
  register: (body) => {
    const errors = [];
    if (!body.email || !EMAIL_REGEX.test(body.email)) {
      errors.push({ field: 'email', message: 'A valid email address is required' });
    }
    if (!body.password || body.password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }
    if (!body.firstName || body.firstName.trim().length === 0) {
      errors.push({ field: 'firstName', message: 'First name is required' });
    }
    return errors;
  },

  login: (body) => {
    const errors = [];
    if (!body.email || !EMAIL_REGEX.test(body.email)) {
      errors.push({ field: 'email', message: 'A valid email address is required' });
    }
    if (!body.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    }
    return errors;
  },

  // Meals
  createMeal: (body) => {
    const errors = [];
    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    if (!body.mealType || !validMealTypes.includes(body.mealType.toLowerCase())) {
      errors.push({ field: 'mealType', message: `mealType must be one of: ${validMealTypes.join(', ')}` });
    }
    if (body.calories !== undefined && (typeof body.calories !== 'number' || body.calories < 0)) {
      errors.push({ field: 'calories', message: 'Calories must be a non-negative number' });
    }
    return errors;
  },

  // Recipes
  publishRecipe: (body) => {
    const errors = [];
    if (!body.name || body.name.trim().length < 3) {
      errors.push({ field: 'name', message: 'Recipe name must be at least 3 characters long' });
    }
    if (body.calories !== undefined && (typeof body.calories !== 'number' || body.calories <= 0)) {
      errors.push({ field: 'calories', message: 'Calories must be a positive number' });
    }
    if (body.ingredients && !Array.isArray(body.ingredients)) {
      errors.push({ field: 'ingredients', message: 'Ingredients must be an array of items' });
    }
    if (body.instructions && !Array.isArray(body.instructions)) {
      errors.push({ field: 'instructions', message: 'Instructions must be an array of steps' });
    }
    return errors;
  },

  recipeReview: (body) => {
    const errors = [];
    const rating = parseInt(body.rating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errors.push({ field: 'rating', message: 'Rating must be an integer between 1 and 5' });
    }
    if (!body.comment || body.comment.trim().length < 2) {
      errors.push({ field: 'comment', message: 'Comment must be at least 2 characters long' });
    }
    return errors;
  },

  // Wearables
  connectWearable: (body) => {
    const errors = [];
    const validDevices = ['apple_health', 'fitbit', 'garmin', 'google_fit', 'whoop'];
    if (!body.deviceType || !validDevices.includes(body.deviceType.toLowerCase())) {
      errors.push({ field: 'deviceType', message: `deviceType must be one of: ${validDevices.join(', ')}` });
    }
    return errors;
  },

  // AI
  analyzePhoto: (body) => {
    const errors = [];
    if (!body.image && !body.imageUrl && !body.sampleId) {
      errors.push({ field: 'image', message: 'An image base64, imageUrl, or sampleId is required for photo analysis' });
    }
    return errors;
  },

  generatePlan: (body) => {
    const errors = [];
    if (body.targetCalories && (typeof body.targetCalories !== 'number' || body.targetCalories < 800 || body.targetCalories > 6000)) {
      errors.push({ field: 'targetCalories', message: 'targetCalories must be between 800 and 6000 kcal' });
    }
    if (body.targetProtein && (typeof body.targetProtein !== 'number' || body.targetProtein < 30 || body.targetProtein > 400)) {
      errors.push({ field: 'targetProtein', message: 'targetProtein must be between 30 and 400 grams' });
    }
    return errors;
  },
};
