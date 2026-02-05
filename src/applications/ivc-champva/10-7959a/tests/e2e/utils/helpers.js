export const goToNextPage = pagePath => {
  cy.findAllByText(/continue|confirm/i, { selector: 'button' })
    .first()
    .click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};

export const startAsNewUser = () => cy.clickStartForm();
