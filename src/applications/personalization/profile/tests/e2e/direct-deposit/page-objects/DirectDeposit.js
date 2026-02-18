import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '@@profile/constants';
import { mockUser } from '@@profile/tests/fixtures/users/user';
import { base } from '../../../../mocks/endpoints/direct-deposits';
import { generateFeatureToggles } from '../../../../mocks/endpoints/feature-toggles';

const defaults = {
  user: mockUser,
  directDepositResponse: base,
  featureToggles: null,
};

class DirectDepositPage {
  LINK_TEXT = 'Direct Deposit Information';

  visitPage = () => {
    cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);
  };

  mockToggles = featureToggles => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'getFeatureToggles',
    );
  };

  setup(opts = defaults) {
    const user = opts.user || defaults.user;

    const directDepositResponse =
      opts.directDepositResponse || defaults.directDepositResponse;

    const featureToggles = opts.featureToggles || generateFeatureToggles();

    cy.login(user);

    cy.intercept(
      'GET',
      '/v0/profile/direct_deposits',
      directDepositResponse,
    ).as('getDirectDeposits');

    this.mockToggles(featureToggles);
  }

  confirmDirectDepositInSubnav = ({
    profile2Enabled = false,
    visitPage = true,
  } = {}) => {
    if (profile2Enabled) {
      cy.get(
        `va-sidenav-item[label="${PROFILE_PATH_NAMES.DIRECT_DEPOSIT}"]`,
      ).should('exist');
    } else {
      // the DD item should exist in the sub nav
      cy.findByRole('navigation', { name: /profile/i }).within(() => {
        cy.findByRole('link', {
          name: PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
        }).should('exist');
      });
    }
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

  confirmIneligibleMessageIsDisplayed = () => {
    cy.findByText(
      /Our records show that you don’t receive benefit payments from VA./i,
    ).should('exist');
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
