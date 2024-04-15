import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VaccinesListPage from './pages/VaccinesListPage';
import emptyVaccinesList from './fixtures/vaccines/vaccines-empty.json';

describe('Medical Records View Vaccines', () => {
  it('Visits Medical Records View Vaccine List', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/');
    VaccinesListPage.clickGotoVaccinesLink(emptyVaccinesList);
    // click on the vaccines link

    cy.get('[data-testid="no-records-message"]').should('be.visible');
    cy.get('[data-testid="print-records-button"]').should('not.exist');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
