import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records View Allergies', () => {
  it('Visits Medical Records View Allergies Details', () => {
    const site = new MedicalRecordsSite();
    site.login(false);
    site.loadPageUnauthenticated();

    cy.url().should('contain', 'my-health/medical-records');

    site.login();
    cy.visit('my-health/medical-records/vitals');
    // Verify "Vitals" Page title Text
    VitalsDetailsPage.verifyVitalsPageText('Vitals');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
