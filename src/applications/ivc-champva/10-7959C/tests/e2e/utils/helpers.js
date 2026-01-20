export const goToNextPage = pagePath => {
  cy.clickFormContinue();
  if (pagePath) cy.location('pathname').should('include', pagePath);
};
