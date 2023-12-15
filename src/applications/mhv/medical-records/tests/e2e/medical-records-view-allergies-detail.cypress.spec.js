import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import allergies from './fixtures/allergies.json';
import allergy from './fixtures/allergy.json';
import AllergiesListPage from './pages/AllergiesListPage';
import AllergyDetailsPage from './pages/AllergyDetailsPage';

describe('Medical Records View Allergies', () => {
  it('Visits Medical Records View Allergies Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records');

    AllergiesListPage.clickGotoAllergiesLink(allergies);
    AllergyDetailsPage.clickAllergyDetailsLink('NUTS', 7006, allergy);
    AllergyDetailsPage.verifyAllergyDetailReaction(
      allergy.reaction[0].manifestation[0].text,
    );

    AllergyDetailsPage.verifyAllergyDetailType('Food');
    // allergy type = food
    AllergyDetailsPage.verifyAllergyDetailLocation(allergy.recorder.display);

    AllergyDetailsPage.verifyAllergyDetailObserved('None noted');

    AllergyDetailsPage.verifyAllergyDetailNotes(allergy.note[0].text);
    cy.get('[data-testid="print-records-button"]').should('be.visible');
    cy.get('[data-testid="print-records-button"]').click({ force: true });
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
