import AllergiesListPage from './pages/AllergiesListPage';
import AllergyDetailsPage from './pages/AllergyDetailsPage';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import allergies from './fixtures/allergies-multiple-pages.json';
import allergyDetail from './fixtures/allergies-details-page-2.json';

describe('Medical Records View Allergies Multiple Page', () => {
  it('Visits Medical Records View Allergies List Clicks Back Button', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records');

    AllergiesListPage.clickGotoAllergiesLink(allergies);
    AllergiesListPage.loadVAPaginationNextAllergies();
    AllergyDetailsPage.clickAllergyDetailsLink(
      allergyDetail.code.text,
      allergyDetail.id,
      allergyDetail,
    );

    cy.go('back');
    AllergiesListPage.verifyPaginationAllergiesDisplayed(11, 14, 14);

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
