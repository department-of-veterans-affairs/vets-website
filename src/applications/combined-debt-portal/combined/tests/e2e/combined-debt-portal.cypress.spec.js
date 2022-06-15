/**
 * [TestRail-integrated] Spec for Combined Debt Portal (CDP) - Overview page
 * @testrailinfo projectId 7
 * @testrailinfo suiteId 8
 * @testrailinfo groupId 5258
 * @testrailinfo runName CDP-E2E-Overview
 */

import mockUser81 from './fixtures/mocks/mock-user-81.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockDebts from '../../../debt-letters/tests/e2e/fixtures/mocks/debts.json';
import mockCopays from '../../../medical-copays/tests/e2e/fixtures/mocks/copays.json';

describe('Your VA debt and bills (overview)', () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.
  before(function skipInCI() {
    if (Cypress.env('CI')) this.skip();
  });

  beforeEach(() => {
    cy.login(mockUser81);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
  });

  context('User has both copay-bill and debts', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/debts', mockDebts).as('debtsA');
      cy.intercept('GET', '/v0/debt_letters', { data: [] }).as('debtLettersA');
      cy.intercept('GET', '/v0/medical_copays', mockCopays).as('copaysA');
    });

    it('should display Copay-bill and Debt summary-cards - C17928', () => {
      cy.visit('/manage-debt-and-bills/summary');
      cy.wait(['@features', '@debtsA', '@debtLettersA', '@copaysA']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-copay')
        .should('exist')
        .within(() => {
          cy.findByTestId('card-amount')
            .invoke('text')
            .should('contain', '61.00');
        });

      cy.findByTestId('balance-card-debt')
        .should('exist')
        .within(() => {
          cy.findByTestId('card-amount')
            .invoke('text')
            .should('contain', '3,305.40');
        });

      cy.injectAxeThenAxeCheck('#react-root');
    });

    it('should navigate to list-pages - C17929', () => {
      cy.visit('/manage-debt-and-bills/summary');
      cy.wait(['@features', '@debtsA', '@debtLettersA', '@copaysA']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-copay')
        .findByTestId('card-link')
        .click();
      cy.url().should('match', /\/copay-balances$/);

      cy.go('back');
      cy.findByTestId('balance-card-debt')
        .findByTestId('card-link')
        .click();
      cy.url().should('match', /\/debt-balances$/);

      cy.injectAxeThenAxeCheck('#react-root');
    });
  });
});
