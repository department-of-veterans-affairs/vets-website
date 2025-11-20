import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import AllergiesListPage from './pages/AllergiesListPage';
import AllergyDetailsPage from './pages/AllergyDetailsPage';
import allergies from './fixtures/allergies-multiple-pages.json';
import allergyDetail from './fixtures/allergies-details-page-2.json';

describe('Medical Records validate breadcrumbs', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('visits list pages and details pages, validates breadcrumbs', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    // site.loadPage();

    AllergiesListPage.goToAllergies(allergies);
    AllergiesListPage.verifyBreadcrumbs('Medical records');
    AllergiesListPage.loadVAPaginationNextAllergies();
    // navigate to allergies details page
    AllergyDetailsPage.clickAllergyDetailsLink(
      allergyDetail.code.text,
      allergyDetail.id,
      allergyDetail,
    );
    const breadcrumbsText = 'Back';
    AllergyDetailsPage.verifyBreadcrumbs(breadcrumbsText);
    AllergyDetailsPage.clickBreadcrumbs(breadcrumbsText);

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
