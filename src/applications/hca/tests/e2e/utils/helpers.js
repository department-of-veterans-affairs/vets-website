export const startAsAuthUser = () => {
  cy.get('[href="#start"]')
    .first()
    .click();
  cy.wait('@mockPrefill');
  cy.location('pathname').should('include', '/check-your-personal-information');
};

export const startAsGuestUser = () => {
  cy.get('.schemaform-start-button')
    .first()
    .click();
  cy.location('pathname').should('include', '/id-form');
};
