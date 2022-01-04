import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '@@profile/constants';

import { mockGETEndpoints } from '@@profile/tests/e2e/helpers';

import mockUserNotInEVSS from '@@profile/tests/fixtures/users/user-non-vet.json';

import mockDD4CNPNotEligible from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-not-eligible.json';
import mockDD4CNPNotEnrolled from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-not-set-up.json';
import mockDD4CNPEnrolled from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-set-up.json';
import mockDD4CNPIncompetent from '@@profile/tests/fixtures/dd4cnp/dd4cnp-incompetent.json';
import mockDD4CNPDeceased from '@@profile/tests/fixtures/dd4cnp/dd4cnp-deceased.json';
import mockDD4CNPFiduciary from '@@profile/tests/fixtures/dd4cnp/dd4cnp-fiduciary.json';

import mockDD4EDUEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-enrolled.json';
import mockDD4EDUNotEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-not-enrolled.json';

import { makeUserObject } from '~/applications/personalization/common/helpers';
import { CSP_IDS } from 'platform/user/authentication/constants';

function confirmDDBlockedAlertIsNotShown() {
  cy.findByRole('heading', { name: /^Profile$/ });
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
  cy.findByRole('navigation', { name: /profile/i }).within(() => {
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
  cy.findByRole('navigation', { name: /profile/i }).within(() => {
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

describe('Direct Deposit section', () => {
  let getPaymentInfoStub;
  let mockUserInEVSS;
  beforeEach(() => {
    getPaymentInfoStub = cy.stub();
    cy.login();
    mockGETEndpoints([
      'v0/profile/personal_information',
      'v0/profile/service_history',
      'v0/profile/full_name',
      'v0/profile/status',
      'v0/mhv_account',
      'v0/feature_toggles*',
      '/v0/disability_compensation_form/rating_info',
      // Both Direct Deposit APIs will fail by default, but most tests will
      // override these responses as needed
      'v0/profile/ch33_bank_accounts',
      'v0/ppiu/payment_information',
    ]);
    mockUserInEVSS = makeUserObject({ services: ['evss-claims'] });
  });
  it('should be blocked if the user is not in EVSS and they are not signed up for DD4EDU', () => {
    cy.intercept('GET', 'v0/user', mockUserNotInEVSS);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUNotEnrolled);
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
    cy.intercept('GET', 'v0/user', mockUserNotInEVSS);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
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
  it('should be blocked if the ID.me user is not enrolled in or eligible for DD4CNP and not signed up for DD4EDU', () => {
    cy.intercept('GET', 'v0/user', mockUserInEVSS);
    cy.intercept('GET', 'v0/ppiu/payment_information', mockDD4CNPNotEligible);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUNotEnrolled);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsNotShown();
  });
  it('should be blocked if the Login.gov user is not enrolled in or eligible for DD4CNP and not signed up for DD4EDU', () => {
    mockUserInEVSS = makeUserObject({
      services: ['evss-claims'],
      serviceName: CSP_IDS.LOGIN_GOV,
    });
    cy.intercept('GET', 'v0/user', mockUserInEVSS);
    cy.intercept('GET', 'v0/ppiu/payment_information', mockDD4CNPNotEligible);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUNotEnrolled);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsNotShown();
  });
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/18321 explains that we _do_ want to block users
  // from the Direct Deposit section in this case, even though they have DD4EDU set up
  it('should be blocked and show an alert if the user is enrolled in DD4EDU but flagged as incompetent by DD4CNP', () => {
    cy.intercept('GET', 'v0/user', mockUserInEVSS);
    cy.intercept('GET', 'v0/ppiu/payment_information', mockDD4CNPIncompetent);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsShown();
  });
  it('should be blocked and show an alert if the user is enrolled in DD4EDU but flagged as being deceased by DD4CNP', () => {
    cy.intercept('GET', 'v0/user', mockUserInEVSS);
    cy.intercept('GET', 'v0/ppiu/payment_information', mockDD4CNPDeceased);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsShown();
  });
  it('should be blocked and show an alert if the user is enrolled in DD4EDU but flagged as having a fiduciary by DD4CNP', () => {
    cy.intercept('GET', 'v0/user', mockUserInEVSS);
    cy.intercept('GET', 'v0/ppiu/payment_information', mockDD4CNPFiduciary);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsShown();
  });
  it('should be blocked if both the `GET payment_information` and `GET ch33_bank_accounts` endpoints fail', () => {
    cy.intercept('GET', 'v0/user', mockUserInEVSS);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsNotShown();

    cy.findByTestId('not-all-data-available-error').should('exist');
  });
  it('should not be blocked if `GET payment_information` fails but they have DD4EDU set up', () => {
    cy.intercept('GET', 'v0/user', mockUserInEVSS);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
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
    cy.intercept('GET', 'v0/user', mockUserInEVSS);
    cy.intercept('GET', 'v0/ppiu/payment_information', mockDD4CNPEnrolled);
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
  it('should not be blocked if they are a Login.gov user and are eligible for DD4CNP', () => {
    mockUserInEVSS = makeUserObject({
      services: ['evss-claims'],
      serviceName: CSP_IDS.LOGIN_GOV,
    });
    cy.intercept('GET', 'v0/user', mockUserInEVSS);
    cy.intercept('GET', 'v0/ppiu/payment_information', mockDD4CNPNotEnrolled);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUNotEnrolled);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsAvailable();
    confirmDDBlockedAlertIsNotShown();
    cy.findByText(
      /You’ll need to verify your identity.*to update.*your direct deposit information online/i,
    ).should('not.exist');
  });
  it('should not be blocked if the user is signed up for DD4CNP', () => {
    cy.intercept('GET', 'v0/user', mockUserInEVSS);
    cy.intercept('GET', 'v0/ppiu/payment_information', mockDD4CNPEnrolled);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUNotEnrolled);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsAvailable();
    confirmDDBlockedAlertIsNotShown();
  });
  it('should not be blocked if the ch33 bank account endpoint is delayed', () => {
    cy.intercept('GET', 'v0/user', mockUserInEVSS);
    cy.intercept('GET', 'v0/ppiu/payment_information', mockDD4CNPEnrolled);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', {
      statusCode: 503,
      delay: 180000,
    });
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsAvailable();
    confirmDDBlockedAlertIsNotShown();
  });
});
