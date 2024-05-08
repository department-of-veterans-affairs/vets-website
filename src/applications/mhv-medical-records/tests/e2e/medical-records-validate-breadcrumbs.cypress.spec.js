import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import AllergiesListPage from './pages/AllergiesListPage';
import AllergyDetailsPage from './pages/AllergyDetailsPage';
// import allergies from './fixtures/allergies.json';
import allergies from './fixtures/allergies-multiple-pages.json';
import allergyDetail from './fixtures/allergies-details-page-2.json';
// import allergy from './fixtures/allergy.json';

describe('Medical Records validate breadcrumbs', () => {
  it('visits list pages and details pages, validates breadcrumbs', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records');
    AllergiesListPage.clickGotoAllergiesLink(allergies);
    AllergiesListPage.verifyBreadcrumbs('Back to Medical records');
    AllergiesListPage.loadVAPaginationNextAllergies();
    // navigate to allergies details page
    // AllergyDetailsPage.clickAllergyDetailsLink('NUTS', 7006, allergy);
    AllergyDetailsPage.clickAllergyDetailsLink(
      allergyDetail.code.text,
      allergyDetail.id,
      allergyDetail,
    );
    AllergyDetailsPage.verifyBreadcrumbs('Back to allergies');
    AllergyDetailsPage.clickBreadcrumbs();
    // cy.get('[data-testid="breadcrumbs"]')
    //   .find('a')
    //   .click();
    // Once the story (MHV-57181) has been implemented, use these parameters: 11, 14, 14
    AllergiesListPage.verifyPaginationAllergiesDisplayed(1, 10, 14);
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
