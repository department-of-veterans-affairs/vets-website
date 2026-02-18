/**
 * [TestRail-integrated] Spec for Medical Copays
 * @testrailinfo projectId 7
 * @testrailinfo suiteId 8
 * @testrailinfo groupId 3090
 * @testrailinfo runName MCP-e2e-Main
 */
import mockFeatureToggles from '../../../combined/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockUser from '../../../combined/tests/e2e/fixtures/mocks/mock-user-81.json';
import {
  copayResponses,
  debtResponses,
} from '../../../combined/tests/e2e/helpers/cdp-helpers';

describe('CDP - Copay navigation and content w/ vha_show_payment_history enabled', () => {
  const id = '4-1abZUKu7xIvIw6';

  beforeEach(() => {
    cy.login(mockUser);
    const adjustedFeatures = mockFeatureToggles;
    adjustedFeatures.data.features.push({
      name: 'vha_show_payment_history',
      value: true,
    });
    cy.intercept('GET', '/v0/feature_toggles*', adjustedFeatures).as(
      'features',
    );
    debtResponses.good('debts');
    copayResponses.goodv1('copays');
    cy.visit('/manage-va-debt/summary/copay-balances');

    // Page load
    cy.wait(['@copays', '@debts', '@features']);
    cy.findByTestId('summary-page-title').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  // unchanged with feature
  it('displays copay balances', () => {
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId(`balance-card-${id}`).should('exist');
    cy.findByTestId(`amount-${id}`).contains('$0.00');
    cy.findByTestId(`facility-city-${id}`).contains('TEST VAMC - LYONS');
    cy.injectAxeThenAxeCheck();
  });

  it('displays updated balance page', () => {
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId(`how-to-pay`).should('not.exist');
    cy.findByTestId(`financial-help`).should('not.exist');
    cy.findByTestId(`dispute-charges`).should('not.exist');
    cy.findByTestId(`balance-questions`).should('not.exist');
    cy.findByTestId(`need-help`).should('exist');
    cy.injectAxeThenAxeCheck();
  });
});
