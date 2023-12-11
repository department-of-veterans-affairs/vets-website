import { generateFeatureToggles } from '@@profile/mocks/endpoints/feature-toggles';
import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';
import { noAccount } from '@@profile/mocks/endpoints/bank-accounts';
import { loa3User72 } from '@@profile/mocks/endpoints/user';

import DirectDeposit from '../DirectDeposit';

describe('Direct Deposit Consistently', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
  });

  it('should display the ineligible message', () => {
    cy.login(loa3User72);
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits/disability_compensations',
      mockDisabilityCompensations.isNotEligible,
    );
    cy.intercept('GET', '/v0/profile/ch33_bank_accounts', noAccount);

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmIneligibleMessageIsDisplayedForCNP();
    DirectDeposit.confirmIneligibleMessageIsDisplayedForEducation();
  });
});
