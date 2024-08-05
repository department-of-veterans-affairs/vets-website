import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import MicrobiologyPage from './pages/MicrobiologyDetailsPage';
import labsAndTests from '../fixtures/labsAndTests.json';

describe('Medical Records Understanding Your Results Microbiology Detail Page', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('Understanding Your Results Microbiology Detail Page', () => {
    // Given As a Medical Records User I wanted to Navigate to "Microbiology" Detail Page
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(4, labsAndTests.entry[2]);
    // When I want to get "help to be able to understand results" of my MR data
    MicrobiologyPage.verifyExpandUnderstandResults();
    MicrobiologyPage.clickExpandUnderstandResults();
    // Results section will be styled to better help the user understand his test results

    // should display  "Your provider will review your results. If you need to do anything, your provider will contact you."
    MicrobiologyPage.verifyResultDropdownReview(
      'Your provider will review your results. If you need to do anything, your provider will contact you.',
    );
    // should display  "If you have any questions, send a message to the care team that ordered this test"
    MicrobiologyPage.verifyResultDropdownQuestion(
      'If you have any questions, send a message to the care team that ordered this test',
    );
    // verify compose a message on the My Healthvet website
    MicrobiologyPage.verifyComposeMessageLink(
      'Compose a message on the My HealtheVet website',
    );

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
