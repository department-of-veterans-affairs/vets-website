import AllergiesListPage from './pages/AllergiesListPage';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import allergies from './fixtures/allergies.json';

describe('Medical Records View Allergies', () => {
  it('Visits Medical Records View Allergies List', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records');

    AllergiesListPage.clickGotoAllergiesLink(allergies);

    cy.title().should(
      'contain',
      'Allergies and Reactions - Medical Records | Veterans Affairs',
    );

    cy.get('select').select('Newest to oldest (date entered)');

    // cy.get('[data-testid="print-download-menu"]')
    //   .should('be.visible')
    //   .click({ force: true });
    AllergiesListPage.verifyPrintOrDownload();
    AllergiesListPage.clickPrintOrDownload();
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
