import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '@@profile/constants';
import { mockUser } from '@@profile/tests/fixtures/users/user';
import { base } from '../../../mocks/endpoints/direct-deposits';
import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';

const defaults = {
  user: mockUser,
  directDepositResponse: base,
  featureToggles: generateFeatureToggles(),
};

class DirectDepositPage {
  LINK_TEXT = 'Direct Deposit Information';

  visitPage = () => {
    cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);
  };

  setup(opts = defaults) {
    const user = opts.user || defaults.user;
    const directDepositResponse =
      opts.directDepositResponse || defaults.directDepositResponse;
    const featureToggles = opts.featureToggles || defaults.featureToggles;

    cy.login(user);

    cy.intercept(
      'GET',
      '/v0/profile/direct_deposits',
      directDepositResponse,
    ).as('getDirectDeposits');

    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'getFeatureToggles',
    );

    this.visitPage();
  }

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

  // TODO: update test ID to not be disability specific for unified form
  confirmIneligibleMessageIsDisplayed = () => {
    cy.findByTestId('disability-header').should('exist');
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

export default DirectDepositPage;
