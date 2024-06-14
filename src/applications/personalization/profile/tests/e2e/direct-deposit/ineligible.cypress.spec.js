import { generateFeatureToggles } from '@@profile/mocks/endpoints/feature-toggles';
import directDepositMocks from '@@profile/mocks/endpoints/direct-deposits';
import { loa3User72 } from '@@profile/mocks/endpoints/user';

import DirectDeposit from './page-objects/DirectDeposit';

const directDeposit = new DirectDeposit();

describe('Direct Deposit Consistently', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
  });

  it('should display the ineligible message', () => {
    directDeposit.setup();
    cy.login(loa3User72);
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits',
      directDepositMocks.isNotEligible,
    );

    directDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    directDeposit.confirmIneligibleMessageIsDisplayed();
  });
});
