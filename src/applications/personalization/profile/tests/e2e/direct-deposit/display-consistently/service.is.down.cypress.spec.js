import DirectDeposit from '../DirectDeposit';
import { paymentHistory } from '../../../../mocks/payment-history';
import bankAccounts from '../../../../mocks/bank-accounts';
import { loa3User72 } from '../../../../mocks/user';

import { generateFeatureToggles } from '../../../../mocks/feature-toggles';

describe('Direct Deposit Consistently', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
  });
  it('should service down message if edu benefits is down', () => {
    cy.login(loa3User72);
    cy.intercept('GET', 'v0/ppiu/payment_information', req => {
      return req.reply(200, paymentHistory.simplePaymentHistory);
    });
    cy.intercept('GET', '/v0/profile/ch33_bank_accounts', req => {
      return req.reply(500, bankAccounts.errorResponse);
    });

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmServiceIsDownMessageShows();
  });
  it('should service down message if cpn is down', () => {
    cy.login(loa3User72);
    cy.intercept('GET', 'v0/ppiu/payment_information', req => {
      return req.reply(500, paymentHistory.errorResponse);
    });
    cy.intercept(
      'GET',
      '/v0/profile/ch33_bank_accounts',
      bankAccounts.anAccount,
    );

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmServiceIsDownMessageShows();
  });
});
