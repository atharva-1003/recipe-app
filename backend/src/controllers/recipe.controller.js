const recipeService = require('../services/recipe.service');

/**
 * Get all recipes with optional pagination and sorting
 */
const getAllRecipes = async (req, res, next) => {
  try {
    const { limit, skip, sortBy, order, select } = req.query;
    const data = await recipeService.getAllRecipes({ limit, skip, sortBy, order, select });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single recipe by ID
 */
const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await recipeService.getRecipeById(id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Search recipes by query string
 */
const searchRecipes = async (req, res, next) => {
  try {
    const { q } = req.query;
    const data = await recipeService.searchRecipes(q);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all recipe tags
 */
const getTags = async (req, res, next) => {
  try {
    const data = await recipeService.getTags();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get recipes by tag
 */
const getRecipesByTag = async (req, res, next) => {
  try {
    const { tag } = req.params;
    const data = await recipeService.getRecipesByTag(tag);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get recipes by meal type
 */
const getRecipesByMealType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const data = await recipeService.getRecipesByMealType(type);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  getTags,
  getRecipesByTag,
  getRecipesByMealType
};
