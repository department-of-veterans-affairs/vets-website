import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VaccinesListPage from './pages/VaccinesListPage';

describe('Medical Records View Vaccines', () => {
  it('Visits Medical Records View Vaccine List', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/');
    VaccinesListPage.clickGotoVaccinesLink();
    // click on the vaccines link
    cy.reload();
    cy.get('@VaccinesList.all').should('have.length', 2);
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
