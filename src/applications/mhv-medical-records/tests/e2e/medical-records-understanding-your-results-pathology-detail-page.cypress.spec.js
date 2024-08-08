import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import PathologyDetailsPage from './pages/PathologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import labsAndTests from './fixtures/labs-and-tests/labsAndTests.json';

describe('Medical Records Understanding Your Results Pathology Detail Page', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('Understanding Your Results Pathology Detail Page', () => {
    // Given As a Medical Records User I wanted to Navigate to "Pathology" Detail Page
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(5, labsAndTests.entry[8]);
    // When I want to get "help to be able to understand results" of my MR data
    PathologyDetailsPage.verifyExpandUnderstandResults();
    PathologyDetailsPage.clickExpandUnderstandResults();
    // Results section will be styled to better help the user understand his test results
    // should display  "Your provider will review your results. If you need to do anything, your provider will contact you."
    PathologyDetailsPage.verifyResultDropdownReview(
      'Your provider will review your results. If you need to do anything, your provider will contact you.',
    );
    // should display  "If you have any questions, send a message to the care team that ordered this test"
    PathologyDetailsPage.verifyResultDropdownQuestion(
      'If you have any questions, send a message to the care team that ordered this test',
    );
    // verify compose a message on the My Healthvet website
    PathologyDetailsPage.verifyComposeMessageLink(
      'Compose a message on the My HealtheVet website',
    );

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
  });
});
