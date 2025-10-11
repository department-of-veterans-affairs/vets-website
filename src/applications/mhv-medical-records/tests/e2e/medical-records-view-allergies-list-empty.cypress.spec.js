import AllergiesListPage from './pages/AllergiesListPage';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import allergies from './fixtures/allergies-empty.json';

describe('Medical Records View Allergies', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records View Allergies List No Allergies', () => {
    AllergiesListPage.goToAllergies(allergies);

    cy.get('[data-testid="no-records-message"]').should('be.visible');

    cy.get('[data-testid="print-download-menu"]').should('not.exist');
    // .click({ force: true });

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
