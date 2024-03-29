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
    cy.get('@allergyDetails.all').should('have.length', 0);
    AllergyDetailsPage.verifyAllergyDetailReaction(
      allergies.entry[0].resource.reaction[0].manifestation[0].text,
    );

    AllergyDetailsPage.verifyAllergyDetailType(
      allergies.entry[0].resource.category[0].charAt(0).toUpperCase(),
    );

    AllergyDetailsPage.verifyAllergyDetailLocation(
      allergies.entry[0].resource.recorder.display,
    );
    // no observed in allergies...
    AllergyDetailsPage.verifyAllergyDetailObserved('None noted');

    AllergyDetailsPage.verifyAllergyDetailNotes(
      allergies.entry[0].resource.note[0].text,
    );
    cy.get('[data-testid="print-records-button"]').should('be.visible');
    cy.get('[data-testid="print-records-button"]').click({ force: true });
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
