export const goToNextPage = pagePath => {
  cy.clickFormContinue();
  if (pagePath) cy.location('pathname').should('include', pagePath);
};

export const startAsNewUser = ({ auth = false } = {}) => {
  if (auth) {
    cy.get('[href="#start"]').click();
    cy.wait('@mockPrefill');
  } else {
    cy.get('a.schemaform-start-button').click();
  }
  cy.location('pathname').should('include', '/who-is-applying');
};

export const startAsInProgressUser = () => {
  cy.get('[data-testid="continue-your-application"]').click();
  cy.wait('@mockPrefill');
};
