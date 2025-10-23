export const goToNextPage = pagePath => {
  cy.findAllByText(/continue/i, { selector: 'button' }).click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};

export const startAsGuestUser = () => {
  cy.get('[href="#start"]')
    .first()
    .click();
};
