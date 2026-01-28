/* eslint-disable camelcase */
// Combined mock responses for both 534 ez and dashboard/my-va
// Usage: n mock-api --responses src/applications/survivors-benefits/tests/fixtures/mocks/combined-local-mock-responses.js

const formResponses = require('./local-mock-responses');
const dashboardResponses = require('../../../../personalization/dashboard/mocks/server');

// Merge responses: simple-forms mocks take precedence for overlapping routes
// This ensures form-specific routes and user data are preserved
// Dashboard mocks are spread first, then form mocks override any conflicts
const combineResponses = {
  ...dashboardResponses,
  ...formResponses,
};

module.exports = combineResponses;
/* eslint-enable camelcase */
