import DirectDeposit from '../DirectDeposit';
import { paymentHistory } from '../../../../mocks/payment-history';
import { user72Success, loa1User } from '../../../../mocks/user';

import { generateFeatureToggles } from '../../../../mocks/feature-toggles';

describe('Direct Deposit Consistently', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
  });

  it('should display the menu item for a standard user -- happy path', () => {
    cy.login(user72Success);
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
    DirectDeposit.confirmDirectDepositIsNotAvailable();
  });
  it('should show the menu for deceased veteran', () => {
    cy.login(user72Success);
    cy.intercept(
      'GET',
      'v0/ppiu/payment_information',
      paymentHistory.isDeceased,
    );

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmDirectDepositIsAvailable({ visitPage: false });
  });
  it('should show the menu for an is not competent veteran', () => {
    cy.login(user72Success);
    cy.intercept(
      'GET',
      'v0/ppiu/payment_information',
      paymentHistory.isNotCompetent,
    );

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmDirectDepositIsAvailable({ visitPage: false });
  });
  it('should show the menu for a has fiduciary veteran', () => {
    cy.login(user72Success);
    cy.intercept(
      'GET',
      'v0/ppiu/payment_information',
      paymentHistory.isFiduciary,
    );

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmDirectDepositIsAvailable({ visitPage: false });
  });
});
