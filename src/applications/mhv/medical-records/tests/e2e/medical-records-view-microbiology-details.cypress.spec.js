import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
// import MicrobiologyDetailsPage from './pages/MicrobiologyDetailsPage';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Microbiology Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');

    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(1);
    //   page.verifyDetailFieldFunction()
    //   EXAMPLE FROM PATHOLOGY DOMAIN:
    //   PathologyDetailsPage.verifyLabName('LR SURGICAL PATHOLOGY REPORT');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
