/**
 * _LOCAL USE ONLY_ - middleware to enable cross-origin requests (CORS).
 * Sets necessary CORS headers and handles preflight requests.
 *
 * @middleware
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void|Response} Returns 200 for preflight requests, otherwise calls next()
 *
 * @example
 * // Apply as middleware to Express app or router
 * app.use(cors);
 *
 * @security
 * - Only for use in local server
 * - Allows all origins ('*')
 * - Allows all common request methods for REST
 * - Allows X-Requested-With and content-type headers
 * - Enables credentials
 */
const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type',
  );
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Handle preflight requests by immediately responding with 200
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  return next();
};

module.exports = cors;
