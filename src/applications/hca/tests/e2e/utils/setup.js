import manifest from '../../../manifest.json';
import mockEnrollmentStatus from '../fixtures/mocks/enrollment-status.json';
import mockFacilities from '../fixtures/mocks/facilities.json';
import mockFeatures from '../fixtures/mocks/feature-toggles.json';
import mockMaintenanceWindows from '../fixtures/mocks/maintenance-windows.json';
import mockPrefill from '../fixtures/mocks/prefill.json';
import mockSaveInProgress from '../fixtures/mocks/save-in-progress.json';
import mockSubmission from '../fixtures/mocks/submission.json';
import mockUser from '../fixtures/mocks/user.json';
import mockVamc from '../fixtures/mocks/vamc-ehr.json';

const APIs = {
  disabilityRating: '/v0/health_care_applications/rating_info',
  facilities: '/v0/health_care_applications/facilities?*',
  features: '/v0/feature_toggles*',
  enrollment: '/v0/health_care_applications/enrollment_status*',
  maintenance: '/v0/maintenance_windows',
  saveInProgress: '/v0/in_progress_forms/1010ez',
  submit: '/v0/health_care_applications',
  vamc: '/data/cms/vamc-ehr.json',
};

const mockDisabilityRating = userPercentOfDisability => ({
  statusCode: 200,
  body: {
    data: {
      id: '',
      type: 'hash',
      attributes: { userPercentOfDisability },
    },
  },
});

export const setupForAuth = (props = {}) => {
  Cypress.config({ scrollBehavior: 'nearest' });

  const {
    disabilityRating = 0,
    enrollmentStatus = mockEnrollmentStatus,
    features = mockFeatures,
    user = mockUser,
  } = props;

  cy.intercept('GET', APIs.features, features).as('mockFeatures');
  cy.intercept('GET', APIs.maintenance, mockMaintenanceWindows);
  cy.intercept('GET', APIs.vamc, mockVamc);
  cy.intercept('GET', APIs.saveInProgress, mockPrefill).as('mockPrefill');
  cy.intercept('PUT', APIs.saveInProgress, mockSaveInProgress);
  cy.intercept('GET', APIs.enrollment, enrollmentStatus).as(
    'mockEnrollmentStatus',
  );
  cy.intercept(
    APIs.disabilityRating,
    mockDisabilityRating(disabilityRating),
  ).as('mockDisabilityRating');
  cy.intercept('GET', APIs.facilities, mockFacilities).as('getFacilities');
  cy.intercept('POST', APIs.submit, mockSubmission).as('mockSubmit');

  cy.login(user);
  cy.visit(manifest.rootUrl);
  cy.wait([
    '@mockUser',
    '@mockFeatures',
    '@mockEnrollmentStatus',
    '@mockDisabilityRating',
  ]);
};

export const setupForGuest = (props = {}) => {
  Cypress.config({ scrollBehavior: 'nearest' });

  const {
    enrollmentStatus = mockEnrollmentStatus,
    features = mockFeatures,
  } = props;

  cy.intercept('GET', APIs.features, features).as('mockFeatures');
  cy.intercept('GET', APIs.maintenance, mockMaintenanceWindows);
  cy.intercept('GET', APIs.vamc, mockVamc);
  cy.intercept('GET', APIs.enrollment, enrollmentStatus).as(
    'mockEnrollmentStatus',
  );
  cy.intercept('GET', APIs.facilities, mockFacilities).as('getFacilities');
  cy.intercept('POST', APIs.submit, mockSubmission).as('mockSubmit');

  cy.visit(manifest.rootUrl);
  cy.wait(['@mockFeatures']);
};

export const setupForFormTester = (props = {}) => {
  Cypress.config({ scrollBehavior: 'nearest' });

  const { features = mockFeatures } = props;

  cy.intercept('GET', APIs.features, features);
  cy.intercept('GET', APIs.maintenance, mockMaintenanceWindows);
  cy.intercept('GET', APIs.vamc, mockVamc);
  cy.intercept('POST', APIs.submit, mockSubmission);
  cy.intercept('GET', APIs.enrollment, mockEnrollmentStatus).as(
    'mockEnrollmentStatus',
  );
  cy.intercept('GET', APIs.facilities, mockFacilities).as('getFacilities');
};
