import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import AllergiesListPage from './pages/AllergiesListPage';
import AllergyDetailsPage from './pages/AllergyDetailsPage';
import allergies from './fixtures/allergies.json';
import allergy from './fixtures/allergy.json';

describe('Medical Records validate breadcrumbs', () => {
  it('visits list pages and details pages, validates breadcrumbs', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records');
    // navigate to allergies list page
    AllergiesListPage.clickGotoAllergiesLink(allergies);
    AllergiesListPage.verifyBreadcrumbs();
    // navigate to allergies details page
    AllergyDetailsPage.clickAllergyDetailsLink('NUTS', 7006, allergy);
    AllergyDetailsPage.verifyBreadcrumbs();
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
