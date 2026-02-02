/**
 * Navigate to the next page by clicking Continue button
 */
export const goToNextPage = pagePath => {
  cy.get('va-button[text*="continue" i]').click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};
