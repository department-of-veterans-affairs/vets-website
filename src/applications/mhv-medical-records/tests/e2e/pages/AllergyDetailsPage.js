import BaseDetailsPage from './BaseDetailsPage';

class AllergyDetailsPage extends BaseDetailsPage {
  verifyTextInsideDropDownOnDetailsPage = () => {
    cy.contains(
      'If you print this page, it won’t include your allergies and reactions to allergies.',
    );
  };

  clickWhatToKnowAboutallergiesDropDown = () => {
    cy.contains('What to know before you print or download').click({
      force: true,
    });
  };

  clickAllergyDetailsLink = (allergyTitle, allergyId, allergyDetails) => {
    cy.intercept(
      'GET',
      `/my_health/v1/medical_records/allergies/${allergyId}`,
      allergyDetails,
    ).as('allergyDetails');
    cy.get('[data-testid="record-list-item"]')
      .contains(allergyTitle)
      .should('be.visible');
    cy.get('[data-testid="record-list-item"]')
      .contains(allergyTitle)
      .click();
  };

  verifyAllergyDetailReaction = reaction => {
    cy.get('[data-testid="allergy-reaction"]').should('contain', reaction);
  };

  verifyAllergyDetailType = type => {
    cy.get('[data-testid="allergy-type"]').should('contain', type);
  };

  verifyAllergyDetailLocation = location => {
    cy.get('[data-testid="allergy-location"]').should('contain', location);
  };

  verifyAllergyDetailObserved = observed => {
    cy.get('[data-testid="allergy-observed"]').should('contain', observed);
  };

  verifyAllergyDetailNotes = notes => {
    cy.get('[data-testid="allergy-notes"]').should('contain', notes);
  };

  verifyBreadcrumbs = breadcrumbsText => {
    cy.get('[data-testid="breadcrumbs"]').contains(`${breadcrumbsText}`, {
      matchCase: false,
    });
  };

  clickBreadcrumbs = () => {
    cy.get('[data-testid="breadcrumbs"]')
      .find('a')
      .click();
  };

  verifySidenavHighlightAllergies = () => {
    cy.get('.is-active').should('contain', 'Allergies and reactions');
  };
}
export default new AllergyDetailsPage();
