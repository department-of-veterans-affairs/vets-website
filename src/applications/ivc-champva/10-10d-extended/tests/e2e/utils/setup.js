import manifest from '../../../manifest.json';
import mockFeatures from '../fixtures/mocks/feature-toggles.json';
import mockMaintenanceWindows from '../fixtures/mocks/maintenance-windows.json';
import mockSubmission from '../fixtures/mocks/submission.json';
import mockVamc from '../fixtures/mocks/vamc-ehr.json';

const APIs = {
  features: '/v0/feature_toggles*',
  maintenance: '/v0/maintenance_windows',
  submit: '/ivc_champva/v1/forms/10-10d-ext',
  vamc: '/data/cms/vamc-ehr.json',
};

export const setupBasicTest = (props = {}) => {
  Cypress.config({ scrollBehavior: 'nearest' });

  const { features = mockFeatures } = props;

  cy.intercept('GET', APIs.features, features).as('mockFeatures');
  cy.intercept('GET', APIs.maintenance, mockMaintenanceWindows);
  cy.intercept('GET', APIs.vamc, mockVamc);
  cy.intercept('POST', APIs.submit, mockSubmission).as('mockSubmit');
};

export const setupForGuest = (props = {}) => {
  const { features = mockFeatures } = props;

  setupBasicTest({ features });

  cy.visit(manifest.rootUrl);
  cy.wait(['@mockFeatures']);
};
