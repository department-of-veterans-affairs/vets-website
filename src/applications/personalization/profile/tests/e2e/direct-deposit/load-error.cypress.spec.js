import { anAccount } from '@@profile/mocks/endpoints/bank-accounts';
import { loa3User72 } from '@@profile/mocks/endpoints/user';
import { data } from '@@profile/mocks/endpoints/mhvAccount';
import DirectDepositPage from './page-objects/DirectDeposit';

const directDeposit = new DirectDepositPage();

describe('Direct Deposit connection error state', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {});
    cy.intercept('GET', '/v0/mhv_account', { data });
    cy.intercept('GET', '/v0/profile/ch33_bank_accounts', anAccount);
    cy.login(loa3User72);
  });

  it('displays correct UI when GET request fails', () => {
    directDeposit.setup();

    cy.intercept('GET', 'v0/profile/direct_deposits', {
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

    directDeposit.visitPage();

    directDeposit.confirmDirectDepositInSubnav();

    // loading error alert should be present
    cy.findByText(/This page isn't available right now./i).should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
