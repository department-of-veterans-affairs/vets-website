export const checkForLegacyLoadingIndicator = (loadingMessage = '') => {
  cy.findByRole('progressbar').should('exist');

  if (loadingMessage) {
    cy.findByText(loadingMessage, { exact: false }).should('exist');
  }

  cy.findByRole('progressbar').should('not.exist', { timeout: 3000 });

  if (loadingMessage) {
    cy.findByText(loadingMessage, { exact: false }).should('not.exist');
  }
};

export const checkForWebComponentLoadingIndicator = (loadingMessage = '') => {
  cy.find('va-loading-indicator').should('exist');

  if (loadingMessage) {
    cy.find('va-loading-indicator')
      .shadow()
      .findByText(loadingMessage, { exact: false })
      .should('exist');
  }

  cy.find('va-loading-indicator', { timeout: 3000 }).should('not.exist');
};
