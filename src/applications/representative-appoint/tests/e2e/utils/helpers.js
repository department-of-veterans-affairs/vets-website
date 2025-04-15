export const startAsAuthUser = () => {
  cy.get('[href="#start"]')
    .first()
    .click();
  cy.wait('@mockPrefill');
  cy.location('pathname').should('include', '/claimant-type');
};
