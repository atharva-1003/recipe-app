/**
 * Validate query parameters for recipe listing
 */
const validateQueryParams = (req, res, next) => {
  const { limit, skip } = req.query;

  if (limit && (isNaN(limit) || parseInt(limit) < 0)) {
    return res.status(400).json({
      error: {
        message: 'Invalid limit parameter. Must be a non-negative number.',
        statusCode: 400
      }
    });
  }

  if (skip && (isNaN(skip) || parseInt(skip) < 0)) {
    return res.status(400).json({
      error: {
        message: 'Invalid skip parameter. Must be a non-negative number.',
        statusCode: 400
      }
    });
  }

  next();
};

module.exports = { validateQueryParams };
