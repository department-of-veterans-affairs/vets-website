/**
 * [TestRail-integrated] Spec for Combined Debt Portal (CDP) - Combined Statements page
 * @testrailinfo projectId 7
 * @testrailinfo suiteId 8
 * @testrailinfo groupId 5258
 * @testrailinfo runName CDP-E2E-Combined-Statements
 */

import mockUser81 from './fixtures/mocks/mock-user-81.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import {
  copayResponses,
  debtResponses,
  vbmsResponses,
} from './helpers/cdp-helpers';

describe('CDP - Combined statements', () => {
  beforeEach(() => {
    cy.login(mockUser81);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    vbmsResponses.empty('debtLetters');
  });

  context('User has no Copays or Debts', () => {
    beforeEach(() => {
      copayResponses.empty('copaysA');
      debtResponses.empty('debtsA');

      cy.visit('/manage-va-debt/summary/combined-statements');
      cy.wait(['@features', '@copaysA', '@debtsA']);
    });

    it('should display page sections correctly', () => {
      cy.findByTestId('detail-page-title').should('exist');
      cy.findByTestId('combined-statements-veteran-info').should('exist');
      cy.findByTestId('combined-statements-recipient-info').should('exist');
      cy.findByTestId('combined-statements-copay-table-TESTFACILITY').should(
        'not.exist',
      );
      cy.injectAxeThenAxeCheck();
    });
  });

  context('User has Copays only', () => {
    beforeEach(() => {
      copayResponses.good('copaysB');
      debtResponses.empty('debtsB');

      cy.visit('/manage-va-debt/summary/combined-statements');
      cy.wait(['@features', '@copaysB', '@debtsB']);
    });

    it('should display copay table correctly', () => {
      cy.findByTestId('detail-page-title').should('exist');
      cy.findByTestId('combined-statements-veteran-info').should('exist');
      cy.findByTestId('combined-statements-recipient-info').should('exist');
      cy.get(
        '[data-testid="combined-statements-copay-table-Ralph H. Johnson Department of Veterans Affairs Medical Center"] > va-table-inner.hydrated',
      ).should('exist');
      cy.get(
        '[data-testid="combined-statements-copay-table-Bob Stump Department of Veterans Affairs Medical Center"] > va-table-inner.hydrated',
      ).should('exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('User has Debts only', () => {
    beforeEach(() => {
      copayResponses.empty('copaysC');
      debtResponses.good('debtsC');

      cy.visit('/manage-va-debt/summary/combined-statements');
      cy.wait(['@features', '@copaysC', '@debtsC']);
      cy.findByTestId('detail-page-title').should('exist');
    });

    it('should display debt table correctly', () => {
      cy.get(
        '[data-testid="combined-statements-debt-table"] > va-table-inner.hydrated',
      ).should('exist');
      cy.get(
        '[data-testid="combined-statements-copay-table-Ralph H. Johnson Department of Veterans Affairs Medical Center"] > va-table-inner.hydrated',
      ).should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('User has both Copays and Debts', () => {
    beforeEach(() => {
      copayResponses.good('copaysD');
      debtResponses.good('debtsD');

      cy.visit('/manage-va-debt/summary/combined-statements');
      cy.wait(['@features', '@copaysD', '@debtsD']);
      cy.findByTestId('detail-page-title').should('exist');
    });

    it('should navigate to Copay-list & Debt-list pages', () => {
      cy.findByTestId('review-copays-link').click();
      cy.url().should('match', /\/copay-balances$/);

      cy.go('back');
      cy.findByTestId('review-debts-link').click();
      cy.url().should('match', /\/debt-balances$/);

      cy.injectAxeThenAxeCheck();
    });
  });
});
