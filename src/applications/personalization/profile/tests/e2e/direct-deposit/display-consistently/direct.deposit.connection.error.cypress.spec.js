import DirectDeposit from '../DirectDeposit';
import { anAccount } from '../../../../mocks/endpoints/bank-accounts';
import { loa3User72 } from '../../../../mocks/endpoints/user';
import { data } from '../../../../mocks/endpoints/mhvAccount';
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
    cy.intercept('GET', 'v0/profile/direct_deposits/disability_compensations', {
      statusCode: 500,
      body: {
        errors: [
          {
            code: '403',
            detail: 'Forbidden',
            source: 'Lighthouse',
            status: '403',
          },
        ],
      },
    });
    DirectDeposit.visitPage();

    DirectDeposit.confirmDirectDepositIsAvailable();

    cy.injectAxeThenAxeCheck();
  });
});
