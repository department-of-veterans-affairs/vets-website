import AllergiesListPage from './pages/AllergiesListPage';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import allergies from './fixtures/allergies.json';

describe('Medical Records View Allergies', () => {
  it('Visits Medical Records View Allergies List', () => {
    const site = new MedicalRecordsSite();
    site.login();
    site.loadPage();

    AllergiesListPage.clickGotoAllergiesLink(allergies);

    cy.get('[data-testid="print-download-menu"]')
      .should('be.visible')
      .click({ force: true });
    // cy.injectAxe();
    // cy.axeCheck('main');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'duplicate-id-aria': {
          enabled: false,
        },
      },
    });
  });
});
