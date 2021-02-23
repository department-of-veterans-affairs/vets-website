import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '@@profile/constants';

import mockUserNotInEVSS from '@@profile/tests/fixtures/users/user-non-vet.json';
import mockUserInEVSS from '@@profile/tests/fixtures/users/user-36.json';

import mockDD4CNPNotEligible from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-not-eligible.json';
import mockDD4CNPNotEnrolled from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-not-set-up.json';
import mockDD4CNPEnrolled from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-set-up.json';
import mockDD4CNPIncompetent from '@@profile/tests/fixtures/dd4cnp/dd4cnp-incompetent.json';
import mockDD4CNPDeceased from '@@profile/tests/fixtures/dd4cnp/dd4cnp-deceased.json';
import mockDD4CNPFiduciary from '@@profile/tests/fixtures/dd4cnp/dd4cnp-fiduciary.json';

import mockDD4EDUEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-enrolled.json';
import mockDD4EDUNotEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-not-enrolled.json';

import error500 from '@@profile/tests/fixtures/500.json';

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

function confirmDirectDepositIsAvailable() {
  // the DD item should exist in the sub nav
  cy.findByRole('navigation', { name: /secondary/i }).within(() => {
    cy.findByRole('link', { name: PROFILE_PATH_NAMES.DIRECT_DEPOSIT }).should(
      'exist',
    );
  });

  // going directly to DD should work
  cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.DIRECT_DEPOSIT}`,
  );
}

function confirmDirectDepositIsBlocked() {
  // the DD item should not exist in the sub nav
  cy.findByRole('navigation', { name: /secondary/i }).within(() => {
    // Just a test to make sure we can access items in the sub nav to ensure
    // the following test isn't a false negative
    cy.findByRole('link', { name: /personal.*info/i }).should('exist');
    cy.findByRole('link', { name: PROFILE_PATH_NAMES.DIRECT_DEPOSIT }).should(
      'not.exist',
    );
  });

  // going directly to DD should redirect to the personal info page
  cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);
  cy.url().should(
    'eq',
    `${Cypress.config().baseUrl}${PROFILE_PATHS.PERSONAL_INFORMATION}`,
  );
}

describe('Direct Deposit', () => {
  let getPaymentInfoStub;
  beforeEach(() => {
    disableFTUXModals();
    getPaymentInfoStub = cy.stub();
    cy.login();
    cy.route('GET', '/v0/feature_toggles*', dd4eduEnabled);
  });
  it('should be blocked if the user is not in EVSS and they are not signed up for DD4EDU', () => {
    cy.route('GET', 'v0/user', mockUserNotInEVSS);
    cy.route('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUNotEnrolled);
    cy.intercept('v0/ppiu/payment_information', () => {
      getPaymentInfoStub();
    });
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsNotShown();
    cy.should(() => {
      expect(getPaymentInfoStub).not.to.be.called;
    });
  });
  it('should not be blocked if the user is not in EVSS but they are signed up for DD4EDU', () => {
    cy.route('GET', 'v0/user', mockUserNotInEVSS);
    cy.route('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
    cy.intercept('v0/ppiu/payment_information', () => {
      getPaymentInfoStub();
    });
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsAvailable();
    confirmDDBlockedAlertIsNotShown();
    cy.should(() => {
      expect(getPaymentInfoStub).not.to.be.called;
    });
  });
  it('should be blocked if the user is not enrolled in or eligible for DD4CNP and not signed up for DD4EDU', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockDD4CNPNotEligible);
    cy.route('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUNotEnrolled);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsNotShown();
  });
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/18321 explains that we _do_ want to block users
  // from the Direct Deposit section in this case, even though they have DD4EDU set up
  it('should be blocked and show an alert if the user is enrolled in DD4EDU but flagged as incompetent by DD4CNP', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockDD4CNPIncompetent);
    cy.route('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsShown();
  });
  it('should be blocked and show an alert if the user is flagged as being deceased by DD4CNP', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockDD4CNPDeceased);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsShown();
  });
  it('should be blocked and show an alert if the user is flagged as having a fiduciary by DD4CNP', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockDD4CNPFiduciary);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsShown();
  });
  it('should be blocked if both the `GET payment_information` and `GET ch33_bank_accounts` endpoints fail', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsNotShown();

    cy.findByTestId('not-all-data-available-error').should('exist');
  });
  it('should not be blocked if `GET payment_information` fails but they have DD4EDU set up', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', error500);
    cy.route('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsAvailable();
    confirmDDBlockedAlertIsNotShown();

    cy.findByTestId('not-all-data-available-error').should('exist');

    cy.findByText(/not receiving disability.*payments/i).should('not.exist');
    cy.findByRole('link', {
      name: /find out.*eligible.*VA disability benefits/i,
    }).should('not.exist');
    cy.findByRole('link', {
      name: /find out.*eligible.*VA pension benefits/i,
    }).should('not.exist');
    cy.findByText(/can’t load disability.*information/i)
      .should('exist')
      .closest('.usa-alert-warning')
      .should('exist');
  });
  it('should not be blocked if `GET ch33_bank_accounts` fails but they have DD4CNP set up', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockDD4CNPEnrolled);
    cy.route('GET', 'v0/profile/ch33_bank_accounts', error500);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsAvailable();
    confirmDDBlockedAlertIsNotShown();

    cy.findByTestId('not-all-data-available-error').should('exist');

    cy.findByText(/not receiving education.*payments/i).should('not.exist');
    cy.findByRole('link', {
      name: /find out.*eligible.*VA education benefits/i,
    }).should('not.exist');
    cy.findByText(/can’t load education.*information/i)
      .should('exist')
      .closest('.usa-alert-warning')
      .should('exist');
  });
  it('should not be blocked if the user is eligible for DD4CNP', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockDD4CNPNotEnrolled);
    cy.route('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUNotEnrolled);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsAvailable();
    confirmDDBlockedAlertIsNotShown();
  });
  it('should not be blocked if the user is signed up for DD4CNP', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockDD4CNPEnrolled);
    cy.route('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUNotEnrolled);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsAvailable();
    confirmDDBlockedAlertIsNotShown();
  });
});
