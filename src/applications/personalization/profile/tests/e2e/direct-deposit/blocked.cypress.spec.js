import directDepositMocks from '@@profile/mocks/endpoints/direct-deposits';
import { anAccount } from '@@profile/mocks/endpoints/bank-accounts';
import { loa3User72 } from '@@profile/mocks/endpoints/user';
import { data } from '@@profile/mocks/endpoints/mhvAccount';
import { generateFeatureToggles } from '@@profile/mocks/endpoints/feature-toggles';

import DirectDepositPage from './page-objects/DirectDeposit';

const directDeposit = new DirectDepositPage();

describe('Direct Deposit Consistently', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {});
    cy.intercept('GET', '/v0/mhv_account', { data });
    cy.intercept('GET', '/v0/profile/ch33_bank_accounts', anAccount);

    cy.login(loa3User72);
    directDeposit.setup({
      featureToggles: generateFeatureToggles({
        profileShowDirectDepositSingleForm: true,
      }),
    });
  });

  it('blocks profile for deceased veterans', () => {
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits',
      directDepositMocks.isDeceased,
    );

    directDeposit.visitPage();

    cy.injectAxeThenAxeCheck();
    directDeposit.confirmDirectDepositIsNotAvailableInNav();
    directDeposit.confirmRedirectToAccountSecurity();
    directDeposit.confirmProfileIsBlocked();
  });
  it('shows blocked message for Fiduciary', () => {
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits',
      directDepositMocks.isFiduciary,
    );
    directDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    directDeposit.confirmDirectDepositIsNotAvailableInNav();
    directDeposit.confirmRedirectToAccountSecurity();
    directDeposit.confirmProfileIsBlocked();
  });
  it('shows blocked message for Not Competent', () => {
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits',
      directDepositMocks.isNotCompetent,
    );
    directDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    directDeposit.confirmDirectDepositIsNotAvailableInNav();
    directDeposit.confirmRedirectToAccountSecurity();
    directDeposit.confirmProfileIsBlocked();
  });
});
