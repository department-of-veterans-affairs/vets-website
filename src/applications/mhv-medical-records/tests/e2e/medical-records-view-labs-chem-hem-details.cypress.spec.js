import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import ChemHemDetailsPage from './pages/ChemHemDetailsPage';
import labsAndTests from '../fixtures/labsAndTests.json';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Labs And Tests Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0, labsAndTests.entry[0]);
    ChemHemDetailsPage.verifyLabName('Potassium');
    ChemHemDetailsPage.verifyLabDate('January 20, 2021');
    ChemHemDetailsPage.verifySampleTested('SERUM');
    ChemHemDetailsPage.verifyOrderedBy('DOE, JANE A');
    ChemHemDetailsPage.verifyLabCollectingLocation('Lab Site 989');
    // There might be a new line in this provider notes example.  we need to check later
    ChemHemDetailsPage.verifyProviderNotes(
      "Jane's Test 1/20/2021 - Second lab",
    );
    ChemHemDetailsPage.verifyProviderNotes('Added Potassium test');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
