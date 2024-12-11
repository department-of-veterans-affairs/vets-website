class Allergies {
  checkLandingPageLinks = () => {
    cy.get('[data-testid="labs-and-tests-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="summary-and-notes-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vaccines-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="health-conditions-oh-landing-page-link"]').should(
      'be.visible',
    );

    cy.get('[data-testid="vitals-oh-landing-page-link"]').should('be.visible');
  };

  goToAllergiesPage = () => {
    cy.get('[data-testid="allergies-landing-page-link"]')
      .should('be.visible')
      .click();
  };
}

export default new Allergies();
