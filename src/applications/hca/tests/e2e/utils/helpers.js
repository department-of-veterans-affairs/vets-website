export const acceptPrivacyAgreement = () => {
  cy.get('va-checkbox[name="privacyAgreementAccepted"]')
    .shadow()
    .find('label')
    .click();
};

export const goToNextPage = pagePath => {
  cy.findAllByText(/continue|confirm/i, { selector: 'button' })
    .first()
    .click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};

export const startAsAuthUser = ({ waitForPrefill = true } = {}) => {
  cy.get('[href="#start"]').first().click();
  cy.location('pathname').should('include', '/check-your-personal-information');
  if (waitForPrefill) cy.wait('@mockPrefill');
};

export const startAsGuestUser = () => {
  cy.get('.schemaform-start-button').first().click();
  cy.location('pathname').should('include', '/id-form');
};

export const startAsInProgressUser = () => {
  cy.get('[data-testid="continue-your-application"]').first().click();
  cy.wait('@mockPrefill');
};
