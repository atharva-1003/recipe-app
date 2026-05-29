const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const { validateQueryParams } = require('../middleware/requestValidator');

// GET /api/recipes/search?q=query - Search recipes (must be before /:id)
router.get('/search', recipeController.searchRecipes);

// GET /api/recipes/tags - Get all tags
router.get('/tags', recipeController.getTags);

// GET /api/recipes/tag/:tag - Get recipes by tag
router.get('/tag/:tag', recipeController.getRecipesByTag);

// GET /api/recipes/meal-type/:type - Get recipes by meal type
router.get('/meal-type/:type', recipeController.getRecipesByMealType);

// GET /api/recipes - Get all recipes with optional pagination
router.get('/', validateQueryParams, recipeController.getAllRecipes);

// GET /api/recipes/:id - Get single recipe
router.get('/:id', recipeController.getRecipeById);

module.exports = router;
