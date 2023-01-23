import DirectDeposit from '../DirectDeposit';
import { paymentHistory } from '../../../../mocks/payment-history';
import { noAccount } from '../../../../mocks/bank-accounts';
import { loa3User72 } from '../../../../mocks/user';

import { generateFeatureToggles } from '../../../../mocks/feature-toggles';

describe('Direct Deposit Consistently', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
  });

  it('should display the ineligible message', () => {
    cy.login(loa3User72);
    cy.intercept(
      'GET',
      'v0/ppiu/payment_information',
      paymentHistory.notEligible,
    );
    cy.intercept('GET', '/v0/profile/ch33_bank_accounts', noAccount);

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmIneligibleMessageIsDisplayedForCNP();
    DirectDeposit.confirmIneligibleMessageIsDisplayedForEducation();
  });
});
