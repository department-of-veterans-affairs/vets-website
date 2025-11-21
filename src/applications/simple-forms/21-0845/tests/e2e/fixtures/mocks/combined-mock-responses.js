/* eslint-disable camelcase */
// Combined mock responses for both simple-forms/21-0845 and dashboard/my-va
// Usage: yarn mock-api --responses ./src/applications/simple-forms/21-0845/tests/e2e/fixtures/mocks/combined-mock-responses.js

const simpleFormsMocks = require('./local-mock-responses');
const dashboardMocks = require('../../../../../../personalization/dashboard/mocks/server');

// Merge responses: simple-forms mocks take precedence for overlapping routes
// This ensures form-specific routes and user data are preserved
// Dashboard mocks are spread first, then simple-forms mocks override any conflicts
const combinedResponses = {
  ...dashboardMocks,
  ...simpleFormsMocks, // Override with simple-forms specific mocks (form210845, user, etc.)
};

module.exports = combinedResponses;
/* eslint-enable camelcase */
