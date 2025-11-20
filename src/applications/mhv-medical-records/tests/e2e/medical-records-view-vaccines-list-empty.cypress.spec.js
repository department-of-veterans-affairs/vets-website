import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VaccinesListPage from './pages/VaccinesListPage';
import emptyVaccinesList from './fixtures/vaccines/vaccines-empty.json';

describe('Medical Records View Vaccines', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records View Vaccine List', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    // cy.visit('my-health/medical-records/');
    VaccinesListPage.goToVaccines(emptyVaccinesList);
    // click on the vaccines link

    cy.get('[data-testid="no-records-message"]').should('be.visible');
    cy.get('[data-testid="print-download-menu"]').should('not.exist');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
