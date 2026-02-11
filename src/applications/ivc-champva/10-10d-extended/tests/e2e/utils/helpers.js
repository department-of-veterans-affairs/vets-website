export const startAsNewUser = ({ auth = false } = {}) => {
  cy.clickStartForm();
  if (auth) cy.wait('@mockPrefill');
  cy.location('pathname').should('include', '/who-is-applying');
};

export const startAsInProgressUser = () => {
  cy.get('[data-testid="continue-your-application"]').click();
  cy.wait('@mockPrefill');
};
