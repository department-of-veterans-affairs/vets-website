import { PROFILE_PATHS } from '../../constants';

import mockFeatureToggles from '../fixtures/feature-toggles.json';

import mockUserNotInEVSS from '../fixtures/users/user-non-vet.json';
import mockUserInEVSS from '../fixtures/users/user-36.json';

import mockPaymentInfoNotEligible from '../fixtures/payment-information/direct-deposit-is-not-eligible.json';
import mockPaymentInfoIncompetent from '../fixtures/payment-information/direct-deposit-incompetent.json';
import mockPaymentInfoDeceased from '../fixtures/payment-information/direct-deposit-deceased.json';
import mockPaymentInfoFiduciary from '../fixtures/payment-information/direct-deposit-fiduciary.json';

describe('Direct Deposit', () => {
  function confirmDDBlockedAlertIsShown() {
    cy.findByRole('alert')
      .should('have.class', 'usa-alert-error')
      .within(() => {
        cy.findByText(/You can’t update your financial information/i).should(
          'exist',
        );
      });
  }
  function confirmDirectDepositIsBlocked() {
    // the DD item should not exist in the sub nav
    cy.findByRole('navigation', { name: /secondary/i }).within(() => {
      // Just a test to make sure we can access items in the sub nav to ensure
      // the following test isn't a false negative
      cy.findByText(/personal.*info/i).should('exist');
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
    window.localStorage.setItem(
      'DISMISSED_ANNOUNCEMENTS',
      JSON.stringify(['single-sign-on-intro']),
    );
    cy.login();
    cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
  });
  it('should be blocked if the user is not in EVSS', () => {
    cy.route('GET', 'v0/user', mockUserNotInEVSS);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    // TODO: add test to make sure that GET payment_information is not called?

    confirmDirectDepositIsBlocked();
    cy.findByRole('alert').should('not.exist');
  });
  it('should be blocked if the user is not enrolled in Direct Deposit and is not eligible to set up Direct Deposit', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockPaymentInfoNotEligible);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    cy.findByRole('alert').should('not.exist');
  });
  it('should be blocked and show an alert if the user is enrolled but flagged as incompetent', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockPaymentInfoIncompetent);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsShown();
  });
  it('should be blocked and show an alert if the user is enrolled but flagged as being deceased', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockPaymentInfoDeceased);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsShown();
  });
  it('should be blocked and show an alert if the user is enrolled but flagged as having a fiduciary', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.route('GET', 'v0/ppiu/payment_information', mockPaymentInfoFiduciary);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();
    confirmDDBlockedAlertIsShown();
  });
  it('should be blocked if the `GET payment_information` endpoint fails', () => {
    cy.route('GET', 'v0/user', mockUserInEVSS);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    confirmDirectDepositIsBlocked();

    cy.findByRole('alert')
      .should('have.class', 'usa-alert-warning')
      .within(() => {
        cy.findByText(/we can’t access/i).should('exist');
        cy.findByText(/something went wrong/i).should('exist');
      });
  });
});
