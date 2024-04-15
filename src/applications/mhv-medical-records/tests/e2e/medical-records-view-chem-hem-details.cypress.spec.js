import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import ChemHemDetailsPage from './pages/ChemHemDetailsPage';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Labs And Tests Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');

    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0);
    ChemHemDetailsPage.verifyLabName(
      'POTASSIUM:SCNC:PT:SER/PLAS:QN:, SODIUM:SCNC:PT:SER/PLAS:QN:',
    );
    ChemHemDetailsPage.verifyLabDate('January 21, 2021');
    ChemHemDetailsPage.verifySampleTested('None noted');
    ChemHemDetailsPage.verifyOrderedBy('None noted');
    ChemHemDetailsPage.verifyLabOrderingLocation('None noted');
    ChemHemDetailsPage.verifyLabCollectingLocation('None noted');
    // There might be a new line in this provider notes example.  we need to check later
    ChemHemDetailsPage.verifyProviderNotes("Lisa's Test 1/20/2021");
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
