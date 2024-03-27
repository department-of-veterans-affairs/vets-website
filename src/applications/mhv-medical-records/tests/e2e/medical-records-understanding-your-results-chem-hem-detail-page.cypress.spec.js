import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import ChemHemDetailsPage from './pages/ChemHemDetailsPage';

describe('Medical Records Understanding Your Results Detail Page', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');
  });

  it('Understanding Your Results Chem/Hem Detail Page', () => {
    // Given As a Medical Records User I wanted to Navigate to "Chemistry And Hematology" Detail Page
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0);

    // When I want to get "help to be able to understand results" of my MR data
    ChemHemDetailsPage.verifyEpnadUnderstandResultsBtton();
    ChemHemDetailsPage.clickExpnadUnderstandResultsBtton();
    // Results section will be styled to better help the user understand his test results
    // should display  "If your results are outside the reference range"
    ChemHemDetailsPage.verifyResultDropdownReferance(
      'If your results are outside the reference range',
    );
    // should display  "Your provider will review your results. If you need to do anything, your provider will contact you."
    ChemHemDetailsPage.verifyResultDropdownReviw(
      'Your provider will review your results. If you need to do anything, your provider will contact you.',
    );
    // should display  "If you have any questions, send a message to the care team that ordered this test"
    ChemHemDetailsPage.verifyResultDropdownQuestion(
      'If you have any questions, send a message to the care team that ordered this test',
    );
    // verify compose a message on the My Healthvet website
    ChemHemDetailsPage.verifyComposeMessageLink(
      'Compose a message on the My HealtheVet website',
    );

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
