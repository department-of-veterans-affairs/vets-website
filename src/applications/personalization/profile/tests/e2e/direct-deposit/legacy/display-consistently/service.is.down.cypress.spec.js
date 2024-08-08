import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';
import DirectDeposit from '../DirectDeposit';
import bankAccounts from '../../../../../mocks/endpoints/bank-accounts';
import { loa3User72 } from '../../../../../mocks/endpoints/user';

import { generateFeatureToggles } from '../../../../../mocks/endpoints/feature-toggles';

describe('Direct Deposit Consistently', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
  });
  it('should show DirectDepositConnectionError alert if edu benefits is down but cnp is operational', () => {
    cy.login(loa3User72);
    cy.intercept(
      'GET',
      '/v0/profile/direct_deposits/disability_compensations',
      req => {
        return req.reply(200, mockDisabilityCompensations.base);
      },
    );
    cy.intercept('GET', '/v0/profile/ch33_bank_accounts', req => {
      return req.reply(500, bankAccounts.errorResponse);
    });

    DirectDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    DirectDeposit.confirmEduConnectionErrorAlertShows();
  });
  it('should service down message if cpn is down and block all of direct deposit', () => {
    cy.login(loa3User72);
    cy.intercept(
      'GET',
      '/v0/profile/direct_deposits/disability_compensations',
      req => {
        return req.reply(
          500,
          mockDisabilityCompensations.updates.errors.generic,
        );
      },
    );
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
