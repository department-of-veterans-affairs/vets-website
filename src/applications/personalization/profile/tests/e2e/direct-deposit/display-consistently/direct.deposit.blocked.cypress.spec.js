import DirectDeposit from '../DirectDeposit';
import { paymentHistory } from '../../../../mocks/payment-history';
import { defaultResponse } from '../../../../mocks/bank-accounts';
import { user72Success } from '../../../../mocks/user';

import { generateFeatureToggles } from '../../../../mocks/feature-toggles';

describe('Direct Deposit Consistently', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
    cy.login(user72Success);

    cy.intercept('GET', '/v0/profile/ch33_bank_accounts', defaultResponse);
  });

  it('happy path', () => {
    cy.intercept(
      'GET',
      'v0/ppiu/payment_information',
      paymentHistory.simplePaymentHistory,
    );
    DirectDeposit.visitPage();
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
