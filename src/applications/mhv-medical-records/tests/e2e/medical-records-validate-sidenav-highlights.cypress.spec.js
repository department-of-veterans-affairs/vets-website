import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import allergies from './fixtures/allergies.json';
import allergy from './fixtures/allergy.json';
import AllergiesListPage from './pages/AllergiesListPage';
import AllergyDetailsPage from './pages/AllergyDetailsPage';

describe('Medical Records Validate Sidenav Highlights', () => {
  it('Visits Medical Records View Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records');

    // navigate to allergies list page
    AllergiesListPage.clickGotoAllergiesLink(allergies);
    AllergyDetailsPage.verifySidenavHighlightAllergies();
    // navigate to allergies details page
    AllergyDetailsPage.clickAllergyDetailsLink('NUTS', 7006, allergy);
    AllergyDetailsPage.verifySidenavHighlightAllergies();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
