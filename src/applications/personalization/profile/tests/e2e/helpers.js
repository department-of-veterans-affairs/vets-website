import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../../constants';

export function subNavOnlyContainsAccountSecurity(mobile) {
  if (mobile) {
    cy.findByRole('button', { name: /profile menu/i }).click();
  }
  cy.findByRole('navigation', { name: /secondary/i }).within(() => {
    cy.findAllByRole('link').should('have.length', 1);
    cy.findByRole('link', {
      name: PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
    }).should('exist');
  });
}

export function onlyAccountSecuritySectionIsAccessible() {
  [
    PROFILE_PATHS.CONNECTED_APPLICATIONS,
    PROFILE_PATHS.DIRECT_DEPOSIT,
    PROFILE_PATHS.MILITARY_INFORMATION,
    PROFILE_PATHS.PERSONAL_INFORMATION,
  ].forEach(path => {
    cy.visit(path);
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
    );
  });
}
