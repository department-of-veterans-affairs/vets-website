import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import AllergiesListPage from './pages/AllergiesListPage';
import AllergyDetailsPage from './pages/AllergyDetailsPage';
import allergies from './fixtures/allergies-multiple-pages.json';
import allergyDetail from './fixtures/allergies-details-page-2.json';

describe('Medical Records validate secondary nav', () => {
  it('visits list pages and details pages, validates secondary nav', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records');
    AllergiesListPage.clickGotoAllergiesLink(allergies);
    AllergiesListPage.verifySecondaryNav();
    AllergiesListPage.selectSort('Newest to oldest (date entered)');
    AllergiesListPage.loadVAPaginationNextAllergies();
    // navigate to allergies details page
    AllergyDetailsPage.clickAllergyDetailsLink(
      allergyDetail.code.text,
      allergyDetail.id,
      allergyDetail,
    );
    AllergyDetailsPage.verifySecondaryNav();
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
