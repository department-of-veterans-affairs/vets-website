import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import PathologyDetailsPage from './pages/PathologyDetailsPage';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Labs And Tests Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');

    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(8);
    PathologyDetailsPage.verifyLabName('LR SURGICAL PATHOLOGY REPORT');
    PathologyDetailsPage.verifyLabDate('August 10, 2000');
    PathologyDetailsPage.verifySampleTested('None noted');
    PathologyDetailsPage.verifyLabLocation('None noted');
    PathologyDetailsPage.verifyDateCompleted('August 10, 2000');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
