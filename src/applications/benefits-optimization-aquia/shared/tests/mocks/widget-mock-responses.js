/**
 * Mock API responses for testing Bio-Aquia CMS widgets
 *
 * Usage:
 *   yarn mock-api --responses ./src/applications/benefits-optimization-aquia/shared/tests/mocks/widget-mock-responses.js
 *
 * Then run:
 *   yarn watch --env entry=static-pages
 *
 * Navigate to:
 *   - http://localhost:3001/form-21-0779-widget/
 *   - http://localhost:3001/form-21-2680-widget/
 *   - http://localhost:3001/form-21-4192-widget/
 *   - http://localhost:3001/form-21p-530a-widget/
 *
 * Toggle Configuration:
 *   Set these to true/false to test different widget states
 */

// Toggle these to test widget states (true = show online link, false = show mail only)
const FORM_0779_ENABLED = false;
const FORM_2680_ENABLED = false;
const FORM_4192_ENABLED = false;
const FORM_530A_ENABLED = false;

const responses = {
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        // Bio-Aquia form toggles
        { name: 'form_0779_enabled', value: FORM_0779_ENABLED },
        { name: 'form_2680_enabled', value: FORM_2680_ENABLED },
        { name: 'form_4192_enabled', value: FORM_4192_ENABLED },
        { name: 'form_530a_enabled', value: FORM_530A_ENABLED },
      ],
    },
  },
};

module.exports = responses;
