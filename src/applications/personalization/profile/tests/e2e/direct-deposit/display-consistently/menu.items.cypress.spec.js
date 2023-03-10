import DirectDeposit from '../DirectDeposit';
import { paymentHistory } from '../../../../mocks/endpoints/payment-history';
import { loa3User72, loa1User } from '../../../../mocks/endpoints/user';

import { generateFeatureToggles } from '../../../../mocks/endpoints/feature-toggles';

describe('Direct Deposit Consistently', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
  });

  it('should display the menu item for a standard user -- happy path', () => {
    cy.login(loa3User72);
    cy.intercept(
      'GET',
      'v0/ppiu/payment_information',
      paymentHistory.simplePaymentHistory,
    );

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmDirectDepositIsAvailable({ visitPage: false });
  });
  it('should hide the menu item for a LOA1 user', () => {
    cy.login(loa1User);
    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmDirectDepositIsNotAvailableInNav();
  });

  it('should hide the menu for deceased veteran and display blocked alert', () => {
    cy.login(loa3User72);
    cy.intercept(
      'GET',
      'v0/ppiu/payment_information',
      paymentHistory.isDeceased,
    );

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmDirectDepositIsNotAvailableInNav();
    DirectDeposit.confirmRedirectToAccountSecurity();
    DirectDeposit.confirmProfileIsBlocked();
  });
  it('should hide the menu for is not competent veteran and display blocked alert', () => {
    cy.login(loa3User72);
    cy.intercept(
      'GET',
      'v0/ppiu/payment_information',
      paymentHistory.isNotCompetent,
    );

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmDirectDepositIsNotAvailableInNav();
    DirectDeposit.confirmRedirectToAccountSecurity();
    DirectDeposit.confirmProfileIsBlocked();
  });
  it('should hide the menu for has fiduciary veteran and display blocked alert', () => {
    cy.login(loa3User72);
    cy.intercept(
      'GET',
      'v0/ppiu/payment_information',
      paymentHistory.isFiduciary,
    );

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmDirectDepositIsNotAvailableInNav();
    DirectDeposit.confirmRedirectToAccountSecurity();
    DirectDeposit.confirmProfileIsBlocked();
  });
});
