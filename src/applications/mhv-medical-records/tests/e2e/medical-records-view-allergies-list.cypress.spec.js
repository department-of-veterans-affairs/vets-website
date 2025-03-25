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

    // select sort by alphabetical
    cy.get('select').select('Alphabetically');
    AllergiesListPage.verifyAllergyTitleByIndex(0, 'MEDIPLAST');
    AllergiesListPage.verifyAllergyTitleByIndex(1, 'NUTS');
    AllergiesListPage.verifyAllergyTitleByIndex(4, 'RED MEAT');

    // select sort by newest to oldest
    cy.get('select').select('Newest to oldest (date entered)');
    AllergiesListPage.verifyAllergyTitleByIndex(0, 'RED MEAT');
    AllergiesListPage.verifyAllergyTitleByIndex(1, 'NUTS');
    AllergiesListPage.verifyAllergyTitleByIndex(4, 'MEDIPLAST');

    // select sort by oldest to newest
    cy.get('select').select('Oldest to newest (date entered)');
    AllergiesListPage.verifyAllergyTitleByIndex(0, 'MEDIPLAST');
    AllergiesListPage.verifyAllergyTitleByIndex(1, 'PENNSAID');
    AllergiesListPage.verifyAllergyTitleByIndex(4, 'RED MEAT');

    AllergiesListPage.verifyPrintOrDownload();
    AllergiesListPage.clickPrintOrDownload();

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
