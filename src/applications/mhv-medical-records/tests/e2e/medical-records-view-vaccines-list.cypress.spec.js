import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
// import VaccinesListPage from './pages/VaccinesListPage';

describe('Medical Records View Vaccines', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records View Vaccine List', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    cy.visit('my-health/medical-records/');
    // VaccinesListPage.goToVaccines();
    // click on the vaccines link
    cy.get('[data-testid="vaccines-landing-page-link"]').click();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
