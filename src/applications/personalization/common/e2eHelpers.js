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
  cy.get('va-loading-indicator').should('exist');

  if (loadingMessage) {
    cy.get('va-loading-indicator')
      .should('exist')
      .then($container => {
        cy.wrap($container)
          .shadow()
          .findByText(loadingMessage, { exact: false })
          .should('exist');
      });
  }

  cy.get('va-loading-indicator', { timeout: 5000 }).should('not.exist');
};

export const findVaLinkByText = text => {
  return cy.get(`va-link[text="${text}"]`);
};
