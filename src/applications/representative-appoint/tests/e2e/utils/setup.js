import manifest from '../../../manifest.json';
import mockFeatures from '../mocks/feature-toggles.json';
import mockPrefill from '../mocks/prefill.json';
import mockSaveInProgress from '../mocks/save-in-progress.json';
import mockUser from '../mocks/user.json';
import mockRepResults from '../mocks/rep-results.json';

const APIs = {
  features: '/v0/feature_toggles*',
  saveInProgress: '/v0/in_progress_forms/21-22',
  repFetch: '/representation_management/v0/original_entities?query=**',
};

export const setupBasicTest = (props = {}) => {
  Cypress.config({ scrollBehavior: 'nearest' });

  const { features = mockFeatures } = props;

  cy.intercept('GET', APIs.features, features).as('mockFeatures');
};

export const setupForAuth = (props = {}) => {
  const {
    features = mockFeatures,
    prefill = mockPrefill,
    user = mockUser,
  } = props;

  setupBasicTest({ features });
  cy.intercept('GET', APIs.saveInProgress, prefill).as('mockPrefill');
  cy.intercept('PUT', APIs.saveInProgress, mockSaveInProgress);
  cy.intercept('GET', APIs.repFetch, mockRepResults).as('fetchRepresentatives');

  cy.login(user);
  cy.visit(manifest.rootUrl);
  cy.wait(['@mockUser', '@mockFeatures']);
};

export const setupForGuest = (props = {}) => {
  const { features = mockFeatures } = props;

  setupBasicTest({ features });

  cy.visit(manifest.rootUrl);
  cy.wait(['@mockFeatures']);
};
