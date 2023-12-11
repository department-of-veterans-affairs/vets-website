import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';
import { anAccount } from '@@profile/mocks/endpoints/bank-accounts';
import { loa3User72 } from '@@profile/mocks/endpoints/user';
import { data } from '@@profile/mocks/endpoints/mhvAccount';

import DirectDeposit from '../DirectDeposit';
import { mockFeatureToggles } from '../../helpers';

describe('Direct Deposit Consistently', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {});
    cy.intercept('GET', '/v0/mhv_account', { data });
    cy.intercept('GET', '/v0/profile/ch33_bank_accounts', anAccount);
    mockFeatureToggles();
    cy.login(loa3User72);
  });

  it('happy path', () => {
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits/disability_compensations',
      mockDisabilityCompensations.base,
    );
    DirectDeposit.visitPage();

    DirectDeposit.confirmDirectDepositIsAvailable();

    cy.injectAxeThenAxeCheck();
  });
  it('blocks profile for deceased veterans', () => {
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits/disability_compensations',
      mockDisabilityCompensations.isDeceased,
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
      'v0/profile/direct_deposits/disability_compensations',
      mockDisabilityCompensations.isFiduciary,
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
      'v0/profile/direct_deposits/disability_compensations',
      mockDisabilityCompensations.isNotCompetent,
    );
    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmDirectDepositIsNotAvailableInNav();
    DirectDeposit.confirmRedirectToAccountSecurity();
    DirectDeposit.confirmProfileIsBlocked();
  });
});
