import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Labs And Tests Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');

    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0);
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
