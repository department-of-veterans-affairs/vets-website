export const goToNextPage = pagePath => {
  // Clicks Continue button, and optionally checks destination path.
  // eslint-disable-next-line cypress/unsafe-to-chain-command
  cy.findAllByText(/continue|confirm/i, { selector: 'button' })
    .first()
    .scrollIntoView()
    .click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};
