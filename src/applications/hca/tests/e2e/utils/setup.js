import manifest from '../../../manifest.json';
import mockAuthEnrollmentStatus from '../fixtures/mocks/enrollment-status.auth.json';
import mockGuestEnrollmentStatus from '../fixtures/mocks/enrollment-status.guest.json';
import mockPdfDownload from '../fixtures/mocks/pdf-download.json';
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
  downloadPdf: '/v0/health_care_applications/download_pdf',
  facilities: '/v0/health_care_applications/facilities*',
  features: '/v0/feature_toggles*',
  enrollment: '/v0/health_care_applications/enrollment_status*',
  maintenance: '/v0/maintenance_windows',
  saveInProgress: '/v0/in_progress_forms/1010ez',
  submit: '/v0/health_care_applications',
  vamc: '/data/cms/vamc-ehr.json',
};

export const setupBasicTest = (props = {}) => {
  Cypress.config({ scrollBehavior: 'nearest' });

  const {
    enrollmentStatus = mockGuestEnrollmentStatus,
    features = mockFeatures,
  } = props;

  cy.intercept('GET', APIs.features, features).as('mockFeatures');
  cy.intercept('GET', APIs.maintenance, mockMaintenanceWindows);
  cy.intercept('GET', APIs.vamc, mockVamc);
  cy.intercept('POST', APIs.enrollment, enrollmentStatus).as(
    'mockEnrollmentStatus',
  );
  cy.intercept('POST', APIs.downloadPdf, mockPdfDownload).as('downloadPdf');
  cy.intercept('GET', APIs.facilities, mockFacilities).as('getFacilities');
  cy.intercept('POST', APIs.submit, mockSubmission).as('mockSubmit');
};

export const setupForAuth = (props = {}) => {
  const {
    disabilityRating = 0,
    enrollmentStatus = mockAuthEnrollmentStatus,
    features = mockFeatures,
    prefill = mockPrefill,
    user = mockUser,
  } = props;

  const mockRating = {
    statusCode: 200,
    body: {
      data: {
        id: '',
        type: 'hash',
        attributes: { userPercentOfDisability: disabilityRating },
      },
    },
  };

  setupBasicTest({ enrollmentStatus, features });
  cy.intercept('GET', APIs.saveInProgress, prefill).as('mockPrefill');
  cy.intercept('PUT', APIs.saveInProgress, mockSaveInProgress);
  cy.intercept(APIs.disabilityRating, mockRating).as('mockDisabilityRating');

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
  const {
    enrollmentStatus = mockGuestEnrollmentStatus,
    features = mockFeatures,
  } = props;

  setupBasicTest({ enrollmentStatus, features });

  cy.visit(manifest.rootUrl);
  cy.wait(['@mockFeatures']);
};
