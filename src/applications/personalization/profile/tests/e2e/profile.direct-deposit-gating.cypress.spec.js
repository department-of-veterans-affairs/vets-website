import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { PROFILE_PATHS } from '../../constants';

import mockUserNotInEVSS from '../fixtures/users/user-non-vet.json';
import mockUserInEVSS from '../fixtures/users/user-36.json';

import mockDD4CNPNotEligible from '../fixtures/dd4cnp/dd4cnp-is-not-eligible.json';
import mockDD4CNPIncompetent from '../fixtures/dd4cnp/dd4cnp-incompetent.json';
import mockDD4CNPDeceased from '../fixtures/dd4cnp/dd4cnp-deceased.json';
import mockDD4CNPFiduciary from '../fixtures/dd4cnp/dd4cnp-fiduciary.json';

// TODO: remove this when we are no longer gating DD4EDU with a feature flag
const dd4eduEnabled = {
  data: {
    type: 'feature_toggles',
    features: [
      {
        name: 'ch33_dd_profile',
        value: true,
      },
    ],
  },
};

describe('Direct Deposit', () => {
  function confirmDDBlockedAlertIsNotShown() {
    cy.findByText(/You can’t update your financial information/i).should(
      'not.exist',
    );
  }

  function confirmDDBlockedAlertIsShown() {
    cy.findByText(/You can’t update your financial information/i)
      .should('exist')
      .closest('.usa-alert-error')
      .should('exist');
  }

  function confirmDirectDepositIsBlocked() {
    // the DD item should not exist in the sub nav
    cy.findByRole('navigation', { name: /secondary/i }).within(() => {
      // Just a test to make sure we can access items in the sub nav to ensure
      // the following test isn't a false negative
      cy.findByRole('link', { name: /personal.*info/i }).should('exist');
      cy.findByRole('link', { name: /direct deposit/i }).should('not.exist');
    });

    // going directly to DD should redirect to the personal info page
    cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
    );
  }

  beforeEach(() => {
    disableFTUXModals();
    cy.login();
    cy.route('GET', '/v0/feature_toggles*', dd4eduEnabled);
  });
  it('should be blocked if the user is not in EVSS and they are not signed up for DD4EDU', () => {
    cy.route('GET', 'v0/user', mockUserNotInEVSS);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    // TODO: add test to make sure that GET payment_information is not called?

    // I attempted to do this based on [this
    // example](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/stubbing-spying__window-fetch/cypress/integration/spy-on-fetch-spec.js)
    // but was unable to get even this simple assertion to work:
    // `cy.window().its('fetch').should('be.called')`

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsNotShown();
  });
  it('should be blocked if the user is not enrolled in or eligible for DD4CNP and not signed up for DD4EDU', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockDD4CNPNotEligible);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsNotShown();
  });
  it('should be blocked and show an alert if the user is enrolled in DD4CNP but flagged as incompetent', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockDD4CNPIncompetent);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsShown();
  });
  it('should be blocked and show an alert if the user is enrolled in DD4CNP but flagged as being deceased', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockDD4CNPDeceased);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsShown();
  });
  it('should be blocked and show an alert if the user is enrolled in DD4CNP but flagged as having a fiduciary', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockDD4CNPFiduciary);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsShown();
  });
  it('should be blocked if the `GET payment_information` and `GET ch33_bank_accounts` endpoints fail', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();

    cy.findByTestId('not-all-data-available-error').should('exist');
    cy.findByText(/something went wrong/i).should('exist');
  });
});
