import mockAttachment from '../fixtures/mocks/attachment.json';
import mockFeatures from '../fixtures/mocks/feature-toggles.json';
import mockMaintenanceWindows from '../fixtures/mocks/maintenance-windows.json';
import mockPrefill from '../fixtures/mocks/prefill.json';
import mockSaveInProgress from '../fixtures/mocks/save-in-progress.json';
import mockSubmission from '../fixtures/mocks/submission.json';
import mockUser from '../fixtures/mocks/user.json';
import mockVamc from '../fixtures/mocks/vamc-ehr.json';

const APIs = {
  features: '/v0/feature_toggles*',
  maintenance: '/v0/maintenance_windows',
  saveInProgress: '/v0/in_progress_forms/10-10D-EXTENDED',
  submit: '/ivc_champva/v1/forms/10-10d-ext',
  upload: '/ivc_champva/v1/forms/submit_supporting_documents*',
  vamc: '/data/cms/vamc-ehr.json',
};

export const setupBasicTest = (props = {}) => {
  Cypress.config({ includeShadowDom: true, scrollBehavior: 'nearest' });

  const { features = mockFeatures } = props;

  cy.intercept('GET', APIs.features, features);
  cy.intercept('GET', APIs.maintenance, mockMaintenanceWindows);
  cy.intercept('GET', APIs.vamc, mockVamc);
  cy.intercept('POST', APIs.submit, mockSubmission);
  cy.intercept('POST', APIs.upload, mockAttachment);
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

  cy.login(user);
};
