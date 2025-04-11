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

    AllergiesListPage.selectSort('Alphabetically');
    AllergiesListPage.verifyAllergyTitleByIndex(
      0, // 'MEDIPLAST'
      allergies.entry[4].resource.code.text,
    );
    AllergiesListPage.verifyAllergyTitleByIndex(
      1, // 'NUTS'
      allergies.entry[0].resource.code.text,
    );
    AllergiesListPage.verifyAllergyTitleByIndex(
      4, // 'RED MEAT'
      allergies.entry[3].resource.code.text,
    );

    AllergiesListPage.selectSort('Newest to oldest (date entered)');
    AllergiesListPage.verifyAllergyTitleByIndex(
      0, // 'RED MEAT'
      allergies.entry[3].resource.code.text,
    );
    AllergiesListPage.verifyAllergyTitleByIndex(
      1, // 'NUTS'
      allergies.entry[0].resource.code.text,
    );
    AllergiesListPage.verifyAllergyTitleByIndex(
      4, // 'MEDIPLAST'
      allergies.entry[4].resource.code.text,
    );

    AllergiesListPage.selectSort('Oldest to newest (date entered)');
    AllergiesListPage.verifyAllergyTitleByIndex(
      0, // 'MEDIPLAST'
      allergies.entry[4].resource.code.text,
    );
    AllergiesListPage.verifyAllergyTitleByIndex(
      1, // 'PENNSAID'
      allergies.entry[1].resource.code.text,
    );
    AllergiesListPage.verifyAllergyTitleByIndex(
      4, // 'RED MEAT'
      allergies.entry[3].resource.code.text,
    );

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
