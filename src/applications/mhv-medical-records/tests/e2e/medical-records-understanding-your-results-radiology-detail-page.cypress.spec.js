import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';

describe('Medical Records Understanding Your Results Detail Page', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');
  });

  it('Understanding Your Results Radiology Detail Page', () => {
    // Given As a Medical Records User I wanted to Navigate to "Radiology" Detail Page
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(9);
    // When I want to get "help to be able to understand results" of my MR data
    RadiologyDetailsPage.verifyEpnadUnderstandResultsBtton();
    RadiologyDetailsPage.clickExpnadUnderstandResultsBtton();
    // Results section will be styled to better help the user understand his test results

    // should display  "Your provider will review your results. If you need to do anything, your provider will contact you."
    RadiologyDetailsPage.verifyResultDropdownReviw(
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
