import mockAttachment from '../fixtures/mocks/attachment.json';
import mockFeatures from '../fixtures/mocks/feature-toggles.json';
import mockMaintenanceWindows from '../fixtures/mocks/maintenance-windows.json';
import mockSaveInProgress from '../fixtures/mocks/sip-put.json';
import mockSubmission from '../fixtures/mocks/submission.json';
import mockUser from '../fixtures/mocks/user.noPrefill.json';
import mockVamc from '../fixtures/mocks/vamc-ehr.json';

const APIs = {
  features: '/v0/feature_toggles*',
  maintenance: '/v0/maintenance_windows',
  saveInProgress: '/v0/in_progress_forms/10-7959F-2',
  submit: '/ivc_champva/v1/forms',
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
  const { features = mockFeatures, user = mockUser } = props;

  setupBasicTest({ features });
  cy.intercept('GET', APIs.saveInProgress, {});
  cy.intercept('PUT', APIs.saveInProgress, mockSaveInProgress);

  cy.login(user);
};
