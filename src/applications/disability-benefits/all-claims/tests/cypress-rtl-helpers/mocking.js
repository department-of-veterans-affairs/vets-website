/**
 * @fileoverview Mocking and test setup helpers for Cypress tests
 * @module cypress-rtl-helpers/mocking
 */

/* cspell:ignore vamc ppiu */

/**
 * Sets up standard mock API responses
 * @function
 * @param {Object} options - Configuration options for mocks
 * @param {Object} [options.featureToggles={}] - Feature toggle configurations
 * @param {Object} [options.prefillData={}] - Prefill data for forms
 * @param {Object} [options.user] - User data for authentication
 * @param {Function} [options.mockItf] - ITF mock function
 * @param {Object} [options.mockInProgress] - In-progress forms mock
 * @param {Object} [options.mockLocations] - Separation locations mock
 * @param {Object} [options.mockPayment] - Payment information mock
 * @param {Object} [options.mockUpload] - Document upload mock
 * @param {Object} [options.mockSubmit] - Form submission mock
 * @param {Object} [options.mockServiceBranches] - Service branches mock
 * @param {string} [options.MOCK_SIPS_API] - SIPS API endpoint
 * @returns {void}
 */
export const setupMocks = options => {
  const {
    featureToggles = {},
    prefillData = {},
    user,
    mockItf,
    mockInProgress,
    mockLocations,
    mockPayment,
    mockUpload,
    mockSubmit,
    mockServiceBranches,
    MOCK_SIPS_API,
  } = options;

  if (user) {
    cy.login(user);
  }

  cy.intercept('GET', '/data/cms/vamc-ehr.json', { body: {} });

  if (mockItf) {
    cy.intercept('GET', '/v0/intent_to_file', mockItf());
  }

  if (mockInProgress) {
    cy.intercept('PUT', `${MOCK_SIPS_API}*`, mockInProgress);
  }

  if (mockLocations) {
    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/separation_locations',
      mockLocations,
    );
  }

  if (mockPayment) {
    cy.intercept('GET', '/v0/ppiu/payment_information', mockPayment);
  }

  if (mockUpload) {
    cy.intercept('POST', '/v0/upload_supporting_evidence', mockUpload);
  }

  if (mockSubmit) {
    cy.intercept(
      'POST',
      '/v0/disability_compensation_form/submit_all_claim*',
      mockSubmit,
    );
  }

  cy.intercept(
    'GET',
    '/v0/disability_compensation_form/submission_status/*',
    '',
  );

  if (mockServiceBranches) {
    cy.intercept(
      'GET',
      '/v0/benefits_reference_data/service-branches',
      mockServiceBranches,
    );
  }

  // Set up feature toggles if provided
  if (Object.keys(featureToggles).length > 0) {
    cy.intercept('GET', '/v0/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          type: 'feature_toggles',
          features: Object.entries(featureToggles).map(([name, value]) => ({
            name,
            value,
          })),
        },
      },
    });
  }

  // Set up prefill data if provided
  if (Object.keys(prefillData).length > 0 && MOCK_SIPS_API) {
    cy.intercept('GET', `${MOCK_SIPS_API}*`, prefillData);
  }
};
