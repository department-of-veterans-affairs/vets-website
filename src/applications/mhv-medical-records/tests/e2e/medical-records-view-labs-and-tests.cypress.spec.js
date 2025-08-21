import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';

describe('Medical Records View Labs and Tests', () => {
  it('Visits Medical Records View Labs and Tests', () => {
    const site = new MedicalRecordsSite();
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();

    cy.injectAxe();
    cy.axeCheck();
  });
});
