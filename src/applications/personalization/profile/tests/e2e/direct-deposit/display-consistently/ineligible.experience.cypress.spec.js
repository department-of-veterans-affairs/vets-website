import DirectDeposit from '../DirectDeposit';
import { paymentHistory } from '../../../../mocks/endpoints/payment-history';
import { noAccount } from '../../../../mocks/endpoints/bank-accounts';
import { loa3User72 } from '../../../../mocks/endpoints/user';

import { generateFeatureToggles } from '../../../../mocks/endpoints/feature-toggles';

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
