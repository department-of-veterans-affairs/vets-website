import DirectDeposit from '../DirectDeposit';
import { paymentHistory } from '../../../../mocks/payment-history';
import { anAccount } from '../../../../mocks/bank-accounts';
import { user72Success } from '../../../../mocks/user';
import { data } from '../../../../mocks/mhvAccount';

import { generateFeatureToggles } from '../../../../mocks/feature-toggles';

describe('Direct Deposit Consistently', () => {
  describe('With profileBlockForFiduciaryDeceasedOrIncompetent feature toggle FALSE', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
      cy.intercept('GET', '/v0/profile/ch33_bank_accounts', anAccount);
      cy.intercept('GET', '/v0/mhv_account', { data });
      cy.login(user72Success);
    });

    it('happy path', () => {
      cy.intercept(
        'GET',
        'v0/ppiu/payment_information',
        paymentHistory.simplePaymentHistory,
      );
      DirectDeposit.visitPage();

      DirectDeposit.confirmDirectDepositIsAvailable();

      cy.injectAxeThenAxeCheck();
    });
    it('shows blocked message for deceased veterans', () => {
      cy.intercept(
        'GET',
        'v0/ppiu/payment_information',
        paymentHistory.isDeceased,
      );
      DirectDeposit.visitPage();
      cy.injectAxeThenAxeCheck();
      DirectDeposit.confirmDirectDepositIsBlocked();
    });
    it('shows blocked message for Fiduciary', () => {
      cy.intercept(
        'GET',
        'v0/ppiu/payment_information',
        paymentHistory.isFiduciary,
      );
      DirectDeposit.visitPage();
      cy.injectAxeThenAxeCheck();
      DirectDeposit.confirmDirectDepositIsBlocked();
    });
    it('shows blocked message for Not Competent', () => {
      cy.intercept(
        'GET',
        'v0/ppiu/payment_information',
        paymentHistory.isNotCompetent,
      );
      DirectDeposit.visitPage();
      cy.injectAxeThenAxeCheck();
      DirectDeposit.confirmDirectDepositIsBlocked();
    });
  });

  describe('With profileBlockForFiduciaryDeceasedOrIncompetent feature toggle TRUE', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileBlockForFiduciaryDeceasedOrIncompetent: true,
        }),
      );
      cy.intercept('GET', '/v0/mhv_account', { data });
      cy.intercept('GET', '/v0/profile/ch33_bank_accounts', anAccount);
      cy.login(user72Success);
    });

    it('happy path', () => {
      cy.intercept(
        'GET',
        'v0/ppiu/payment_information',
        paymentHistory.simplePaymentHistory,
      );
      DirectDeposit.visitPage();

      DirectDeposit.confirmDirectDepositIsAvailable();

      cy.injectAxeThenAxeCheck();
    });
    it('blocks profile for deceased veterans', () => {
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
    it('shows blocked message for Fiduciary', () => {
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
    it('shows blocked message for Not Competent', () => {
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
  });
});
