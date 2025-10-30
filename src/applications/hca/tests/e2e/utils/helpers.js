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

export const startAsAuthUser = (opts = {}) => {
  const { waitForPrefill = true } =
    typeof opts === 'boolean' ? { waitForPrefill: !opts } : opts;

  cy.get('[href="#start"]')
    .first()
    .click();
  if (waitForPrefill) cy.wait('@mockPrefill');
  cy.location('pathname').should('include', '/check-your-personal-information');
};

export const startAsGuestUser = () => {
  cy.get('.schemaform-start-button')
    .first()
    .click();
  cy.location('pathname').should('include', '/id-form');
};

export const startAsInProgressUser = () => {
  cy.get('[data-testid="continue-your-application"]')
    .first()
    .click();
  cy.wait('@mockPrefill');
};
