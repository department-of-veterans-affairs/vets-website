/**
 * [TestRail-integrated] Spec for Combined Debt Portal (CDP) - Overview page
 * @testrailinfo projectId 7
 * @testrailinfo suiteId 8
 * @testrailinfo groupId 5258
 * @testrailinfo runName CDP-E2E-Overview
 */

import mockUser81 from './fixtures/mocks/mock-user-81.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import {
  copayResponses,
  debtResponses,
  vbmsResponses,
} from './helpers/cdp-helpers';

describe('CDP - Overpayments and copay bills (overview)', () => {
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

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysA', '@debtsA']);
      cy.findByTestId('overview-page-title').should('exist');
    });

    it('should display No-copays-or-debts alert - C17928', () => {
      cy.get('h2').should(
        'contain',
        'You don’t have any outstanding overpayments or copay bills',
      );

      cy.findByTestId('balance-card-copay').should('not.exist');
      cy.findByTestId('balance-card-debt').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  context('User has Copays only', () => {
    beforeEach(() => {
      copayResponses.good('copaysB');
      debtResponses.empty('debtsB');

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysB', '@debtsB']);
      cy.findByTestId('overview-page-title').should('exist');
    });

    it('should display Copay summary-card & No-debts alert - C17929', () => {
      cy.findByTestId('balance-card-copay')
        .should('exist')
        .within(() => {
          cy.findByTestId('card-amount')
            .invoke('text')
            .should('contain', '61.00');
        });
      cy.findByTestId('balance-card-zero-debt').should('exist');

      cy.findByTestId('balance-card-zero-copay').should('not.exist');
      cy.findByTestId('balance-card-debt').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should navigate to Copay-list page - C18020', () => {
      cy.findByTestId('balance-card-copay')
        .findByTestId('card-link')
        .click();
      cy.url().should('match', /\/copay-balances$/);

      cy.injectAxeThenAxeCheck();
    });
  });

  context('User has Debts only', () => {
    beforeEach(() => {
      copayResponses.empty('copaysC');
      debtResponses.good('debtsC');

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysC', '@debtsC']);
      cy.findByTestId('overview-page-title').should('exist');
    });

    it('should display No-Copays alert & Debt summary-card - C18021', () => {
      cy.findByTestId('balance-card-zero-copay').should('exist');
      cy.findByTestId('balance-card-debt')
        .should('exist')
        .within(() => {
          cy.findByTestId('card-amount')
            .invoke('text')
            .should('contain', '4,655.40');
        });

      cy.findByTestId('balance-card-copay').should('not.exist');
      cy.findByTestId('balance-card-zero-debt').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should navigate to Debt-list page - C18022', () => {
      cy.findByTestId('balance-card-debt')
        .findByTestId('card-link')
        .click();
      cy.url().should('match', /\/debt-balances$/);

      cy.injectAxeThenAxeCheck();
    });
  });

  context('User has both Copays and Debts', () => {
    beforeEach(() => {
      copayResponses.good('copaysD');
      debtResponses.good('debtsD');

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysD', '@debtsD']);
      cy.findByTestId('overview-page-title').should('exist');
    });

    it('should display Copay and Debt summary-cards - C18023', () => {
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
            .should('contain', '4,655.40');
        });

      cy.findByTestId('balance-card-zero-copay').should('not.exist');
      cy.findByTestId('balance-card-zero-debt').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should navigate to Copay-list & Debt-list pages - C18024', () => {
      cy.findByTestId('balance-card-copay')
        .findByTestId('card-link')
        .click();
      cy.url().should('match', /\/copay-balances$/);

      cy.go('back');
      cy.findByTestId('balance-card-debt')
        .findByTestId('card-link')
        .click();
      cy.url().should('match', /\/debt-balances$/);

      cy.injectAxeThenAxeCheck();
    });
  });

  context('User is not enrolled in healthcare', () => {
    it('should display not enrolled in healthcare alert', () => {
      copayResponses.notEnrolled('copaysNE');
      debtResponses.good('debtsNE');

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysNE', '@debtsNE']);

      cy.findByTestId('overview-page-title').should('exist');
      cy.findByTestId('copay-no-health-care-alert').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  context('Error states', () => {
    it('should display Copays error message upon copays API-404-error - C18216', () => {
      copayResponses.bad('copaysE1');
      debtResponses.good('debtsE1');

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysE1', '@debtsE1']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-alert-copay').should('exist');
      cy.findByTestId('balance-card-copay').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should display Debts error message upon debts API-404-error - C18217', () => {
      copayResponses.good('copaysE2');
      debtResponses.bad('debtsE2');

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysE2', '@debtsE2']);

      cy.findByTestId('overview-page-title').should('exist');
      cy.findByTestId('balance-card-alert-debt').should('exist');
      cy.findByTestId('balance-card-debt').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should display Combined error message upon both API-404-errors - C18218', () => {
      copayResponses.bad('copaysE3');
      debtResponses.bad('debtsE3');

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysE3', '@debtsE3']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-combo-alert-error').should('exist');
      cy.findByTestId('balance-card-copay').should('not.exist');
      cy.findByTestId('balance-card-debt').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
