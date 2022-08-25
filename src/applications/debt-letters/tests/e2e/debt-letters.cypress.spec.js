/**
 * [TestRail-integrated] Spec for Debt Letters (DL)
 * @testrailinfo projectId 7
 * @testrailinfo suiteId 8
 * @testrailinfo groupId 318
 * @testrailinfo runName DL-e2e-List
 */
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockDebts from './fixtures/mocks/debts.json';
import mockUser from './fixtures/mocks/mock-user.json';
import mockCopays from '../../../medical-copays/tests/e2e/fixtures/mocks/copays.json';

describe('Debt Letters', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles).as(
      'features',
    );
    cy.intercept('GET', '/v0/debts', mockDebts).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockCopays);
    cy.visit('/manage-va-debt/your-debt/');
    cy.wait(['@features', '@debts']);
  });

  it('displays the current debts section and navigates to debt details - C1226', () => {
    cy.findByTestId('debts-jumplink').click({ waitForAnimations: true });
    cy.get('[data-testclass="debt-details-button"]')
      .first()
      .click();
    cy.get('#debtLetterHistory').should('be.visible');
    cy.injectAxeThenAxeCheck();
  });

  it('displays other va debts', () => {
    cy.findByTestId('other-va-copay-body').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  /* eslint-disable @department-of-veterans-affairs/axe-check-required */
  // Same display-states below as test above which already had AXE-check.

  it('displays download debt letters - C1227', () => {
    cy.findByTestId('download-jumplink').click({ waitForAnimations: true });
    cy.findByTestId('download-letters-link').click();
    cy.get('#downloadDebtLetters').should('be.visible');
  });

  it('displays how do I pay my VA debt? - C1228', () => {
    cy.findByTestId('howto-pay-jumplink').click({ waitForAnimations: true });
    cy.get('#howDoIPay').should('be.visible');
  });

  it('displays how do I get financial help? - C1229', () => {
    cy.findByTestId('howto-help-jumplink').click({ waitForAnimations: true });
    cy.get('#howDoIGetHelp').should('be.visible');
  });

  it('displays how do I dispute a debt? - C1230', () => {
    cy.findByTestId('howto-dispute-jumplink').click({
      waitForAnimations: true,
    });
    cy.get('#howDoIDispute').should('be.visible');
  });
  /* eslint-enable @department-of-veterans-affairs/axe-check-required */
});
