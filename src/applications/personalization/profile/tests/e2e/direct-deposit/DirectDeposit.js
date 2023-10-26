import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '@@profile/constants';

class DirectDepositPage {
  LINK_TEXT = 'Direct Deposit Information';

  visitPage = () => {
    cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);
  };

  confirmDirectDepositIsAvailable = ({ visitPage = true } = {}) => {
    // the DD item should exist in the sub nav
    cy.findByRole('navigation', { name: /profile/i }).within(() => {
      cy.findByRole('link', { name: PROFILE_PATH_NAMES.DIRECT_DEPOSIT }).should(
        'exist',
      );
    });
    if (visitPage) {
      // going directly to DD should work
      cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}${PROFILE_PATHS.DIRECT_DEPOSIT}`,
      );
    }
  };

  confirmDirectDepositIsNotAvailableInNav = () => {
    // the DD item should exist in the sub nav
    cy.findByText(this.LINK_TEXT).should('not.exist');
  };

  confirmIneligibleMessageIsDisplayedForCNP = () => {
    cy.findByTestId('disability-header').should('exist');
  };

  confirmIneligibleMessageIsDisplayedForEducation = () => {
    cy.findByTestId('education-header').should('exist');
  };

  checkVerifyMessageIsShowing = () => {
    cy.findAllByTestId('direct-deposit-mfa-message').should('exist');
  };

  confirmDirectDepositIsBlocked = () => {
    cy.findByTestId('direct-deposit-blocked').should('exist');
  };

  confirmServiceIsDownMessageShows = () => {
    cy.findByTestId('service-is-down-banner').should('exist');
  };

  confirmProfileIsBlocked = () => {
    cy.findByTestId('account-blocked-alert').should('exist');
  };

  confirmRedirectToAccountSecurity = () => {
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
    );
  };
}

export default new DirectDepositPage();
