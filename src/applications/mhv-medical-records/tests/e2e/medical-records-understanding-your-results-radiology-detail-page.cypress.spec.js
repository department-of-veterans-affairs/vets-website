import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
// import labsAndTests from '../fixtures/labsAndTests.json';
import radiologyRecordsMhv from '../fixtures/radiologyRecordsMhv.json';

describe('Medical Records Understanding Your Results Detail Page', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('Understanding Your Results Radiology Detail Page', () => {
    // Given As a Medical Records User I wanted to Navigate to "Radiology" Detail Page
    // I think the second parameter doesn't do anything right now...
    // "Radiology results are coming from an MHV (legacy) API, however,
    // that endpoint is not working for us yet so we are just using
    // mocked data for radiology (radiologyRecordsMhv.json). They are
    // being mixed in with the labs and tests records from FHIR when
    // viewed on the labs and tests list page."
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(
      0,
      radiologyRecordsMhv[16],
    );
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
    RadiologyDetailsPage.verifyComposeMessageLink(
      'Compose a message on the My HealtheVet website',
    );

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
