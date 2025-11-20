import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import sessionStatus from './fixtures/session-status.json';
// import labsAndTests from '../fixtures/labsAndTests.json';
// import radiologyRecordsMhv from '../fixtures/radiologyRecordsMhv.json';

describe('Medical Records Understanding Your Results Detail Page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    cy.intercept('POST', '/my_health/v1/medical_records/session', {
      statusCode: 204,
      body: {},
    }).as('session');
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', {
      statusCode: 200,
      body: sessionStatus, // status response copied from staging
    }).as('status');
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('Understanding Your Results Radiology Detail Page', () => {
    LabsAndTestsListPage.clickRadiologyDetailsLink('CHEST 2 VIEWS PA&LAT');
    // When I want to get "help to be able to understand results" of my MR data
    RadiologyDetailsPage.verifyExpandUnderstandResults();
    RadiologyDetailsPage.clickExpandUnderstandResults();
    // Results section will be styled to better help the user understand his test results

    // should display  "Your provider will review your results. If you need to do anything, your provider will contact you."
    RadiologyDetailsPage.verifyResultDropdownReview(
      'Your provider will review your results. If you need to do anything, your provider will contact you.',
    );
    // should display  "If you have any questions, send a message to the care team that ordered this test"
    RadiologyDetailsPage.verifyResultDropdownQuestion(
      'If you have any questions, send a message to the care team that ordered this test',
    );

    // verify compose a message on the My Healthvet website
    RadiologyDetailsPage.verifyComposeMessageLink('Start a new message');

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
