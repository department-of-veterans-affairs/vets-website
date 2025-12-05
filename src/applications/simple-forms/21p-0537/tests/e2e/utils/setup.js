import manifest from '../../../manifest.json';
import formConfig from '../../../config/form';
import mockUser from '../fixtures/mocks/user.json';
import mockSipGet from '../fixtures/mocks/sip-get.json';
import mockSipPut from '../fixtures/mocks/sip-put.json';
import mockFeatureToggles from '../fixtures/mocks/featureToggles.json';

const APIs = {
  features: '/v0/feature_toggles*',
  user: '/v0/user',
  saveInProgress: '/v0/in_progress_forms/21P-0537',
  submit: formConfig.submitUrl,
};

/**
 * Setup basic test configuration with common mocks
 */
export const setupBasicTest = (props = {}) => {
  const { features = mockFeatureToggles } = props;

  // Configure Cypress
  cy.config('includeShadowDom', true);
  cy.config('retries', { runMode: 0 });

  // Mock API endpoints
  cy.intercept('GET', APIs.features, features);

  // Mock the form submission endpoint
  cy.intercept('POST', APIs.submit, req => {
    cy.get('@testData').then(_data => {
      expect(req.body).to.have.property('recipient');
      expect(req.body).to.have.property('remarriage');
      expect(req.body).to.have.property('veteran');
    });
    req.reply({ status: 200 });
  }).as('mockSubmit');
};

/**
 * Setup test for authenticated user
 */
export const setupForAuth = (props = {}) => {
  const {
    user = mockUser,
    prefill = mockSipGet,
    features = mockFeatureToggles,
  } = props;

  setupBasicTest({ features });

  // Mock save in progress endpoints
  cy.intercept('GET', APIs.saveInProgress, prefill);
  cy.intercept('PUT', APIs.saveInProgress, mockSipPut);
  cy.intercept('GET', APIs.user, user);

  // Login user
  cy.login(user);
  cy.visit(manifest.rootUrl);
  cy.wait('@mockUser');
};
