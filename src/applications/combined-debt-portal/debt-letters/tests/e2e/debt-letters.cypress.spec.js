import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockDebts from './fixtures/mocks/debts.json';
import mockUser from './fixtures/mocks/mock-user.json';
import mockCopays from '../../../medical-copays/tests/e2e/fixtures/mocks/copays.json';

describe('Debt Letters', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    cy.intercept('GET', '/v0/debts', mockDebts).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockCopays);
    cy.visit('/manage-va-debt/summary/debt-balances');
    cy.wait(['@features', '@debts']);
  });

  it('displays the current debts section and navigates to debt details', () => {
    cy.findByTestId('debts-jumplink').click({ waitForAnimations: true });
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
  it('displays download debt letters', () => {
    cy.findByTestId('download-jumplink').click({ waitForAnimations: true });
    cy.findByTestId('download-letters-link').click();
    cy.get('#downloadDebtLetters').should('be.visible');
    cy.injectAxeThenAxeCheck();
  });

  it('displays how do I pay my VA debt?', () => {
    cy.findByTestId('howto-pay-jumplink').click({ waitForAnimations: true });
    cy.get('#howDoIPay').should('be.visible');
    cy.injectAxeThenAxeCheck();
  });

  it('displays how do I get financial help?', () => {
    cy.findByTestId('howto-help-jumplink').click({ waitForAnimations: true });
    cy.get('#howDoIGetHelp').should('be.visible');
    cy.injectAxeThenAxeCheck();
  });

  it('displays how do I dispute a debt?', () => {
    cy.findByTestId('howto-dispute-jumplink').click({
      waitForAnimations: true,
    });
    cy.get('#howDoIDispute').should('be.visible');
    cy.injectAxeThenAxeCheck();
  });
});
