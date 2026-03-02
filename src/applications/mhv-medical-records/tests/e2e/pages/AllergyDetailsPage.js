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
    cy.contains(allergyTitle, { includeShadowDom: false }).click();
    // Wait for detail page to load - check for print menu as indicator
    cy.get('[data-testid="print-download-menu"]', { timeout: 10000 }).should(
      'be.visible',
    );
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
    cy.get('[data-testid="mr-breadcrumbs"]').contains(`${breadcrumbsText}`, {
      matchCase: false,
    });
  };

  clickBreadcrumbs = breadcrumb => {
    cy.get('[data-testid="mr-breadcrumbs"]')
      .find('a')
      .contains(breadcrumb)
      .click({ waitForAnimations: true });
  };

  verifySidenavHighlightAllergies = () => {
    cy.get('.is-active').should('contain', 'Allergies and reactions');
  };

  verifySecondaryNav = () => {
    cy.get('[data-testid="mhv-sec-nav-item"]')
      .eq(4)
      .find('a')
      .contains('Records')
      .should('be.visible');
    cy.get('[data-testid="mhv-sec-nav-item"]')
      .eq(4)
      .find('a')
      .should('have.attr', 'href', '/my-health/medical-records/');
  };
}
export default new AllergyDetailsPage();
