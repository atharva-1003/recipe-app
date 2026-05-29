const API_BASE_URL = process.env.API_BASE_URL || 'https://dummyjson.com';

/**
 * Fetch wrapper with error handling
 */
const fetchFromAPI = async (endpoint) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`[Service] Fetching: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(`API responded with status ${response.status}`);
    error.statusCode = response.status;
    throw error;
  }

  return response.json();
};

/**
 * Get all recipes with optional query params
 */
const getAllRecipes = async ({ limit, skip, sortBy, order, select } = {}) => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit);
  if (skip) params.append('skip', skip);
  if (sortBy) params.append('sortBy', sortBy);
  if (order) params.append('order', order);
  if (select) params.append('select', select);

  const queryString = params.toString();
  return fetchFromAPI(`/recipes${queryString ? '?' + queryString : ''}`);
};

/**
 * Get a single recipe by ID
 */
const getRecipeById = async (id) => {
  return fetchFromAPI(`/recipes/${id}`);
};

/**
 * Search recipes by query
 */
const searchRecipes = async (query) => {
  return fetchFromAPI(`/recipes/search?q=${encodeURIComponent(query || '')}`);
};

/**
 * Get all tags
 */
const getTags = async () => {
  return fetchFromAPI('/recipes/tags');
};

/**
 * Get recipes by tag
 */
const getRecipesByTag = async (tag) => {
  return fetchFromAPI(`/recipes/tag/${encodeURIComponent(tag)}`);
};

/**
 * Get recipes by meal type
 */
const getRecipesByMealType = async (type) => {
  return fetchFromAPI(`/recipes/meal-type/${encodeURIComponent(type)}`);
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  getTags,
  getRecipesByTag,
  getRecipesByMealType
};
