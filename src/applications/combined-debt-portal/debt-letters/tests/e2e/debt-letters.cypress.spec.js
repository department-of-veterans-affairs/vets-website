import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockUser from './fixtures/mocks/mock-user.json';
import {
  copayResponses,
  debtResponses,
} from '../../../combined/tests/e2e/helpers/cdp-helpers';

describe('Debt Letters - downloads enabled', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    debtResponses.good('debts');
    copayResponses.good('copays');
    cy.visit('/manage-va-debt/summary/debt-balances');
    cy.wait(['@features', '@debts']);
  });

  it('displays the current debts section and navigates to debt details', () => {
    cy.get('[data-testid="debt-details-button"]')
      .first()
      .click();
    cy.get('#debtLetterHistory').should('be.visible');
    cy.injectAxeThenAxeCheck();
  });

  it('displays other va debts', () => {
    cy.findByTestId('other-va-copay-body').should('exist');
    cy.injectAxeThenAxeCheck();
  });
});

describe('Debt Letters - downloads disabled', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          { name: 'debt_letters_show_letters_vbms', value: false },
          {
            name: 'combined_debt_portal_access',
            value: true,
          },
        ],
      },
    }).as('features');
    debtResponses.good('debts');
    copayResponses.good('copays');
    cy.visit('/manage-va-debt/summary/debt-balances');
    cy.wait(['@copays', '@debts', '@features']);
  });

  it('does not display download debt letters', () => {
    cy.findByTestId('download-jumplink').should('not.exist');
    cy.findByTestId('download-letters-link').should('not.exist');
    cy.get('#downloadDebtLetters').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
