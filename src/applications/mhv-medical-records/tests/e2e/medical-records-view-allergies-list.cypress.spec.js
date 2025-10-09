import AllergiesListPage from './pages/AllergiesListPage';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import allergies from './fixtures/allergies.json';

describe('Medical Records View Allergies', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records View Allergies List', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    // site.loadPage();

    AllergiesListPage.goToAllergies(allergies);

    cy.title().should(
      'contain',
      'Allergies and Reactions - Medical Records | Veterans Affairs',
    );

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
