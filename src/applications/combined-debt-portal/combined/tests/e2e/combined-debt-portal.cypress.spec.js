/**
 * [TestRail-integrated] Spec for Combined Debt Portal (CDP) - Overview page
 * @testrailinfo projectId 7
 * @testrailinfo suiteId 8
 * @testrailinfo groupId 5258
 * @testrailinfo runName CDP-E2E-Overview
 */

import mockUser81 from './fixtures/mocks/mock-user-81.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockCopays from '../../../medical-copays/tests/e2e/fixtures/mocks/copays.json';
import mockDataEmpty from './fixtures/mocks/mockDataEmpty.json';
import mockDebts from '../../../debt-letters/tests/e2e/fixtures/mocks/debts.json';
import mockDebtsEmpty from './fixtures/mocks/mockDebtsEmpty.json';

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

  context('User has no Copays or Debts', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/medical_copays', mockDataEmpty).as('copaysA');
      cy.intercept('GET', '/v0/debts', mockDebtsEmpty).as('debtsA');
      cy.intercept('GET', '/v0/debt_letters', mockDataEmpty).as('debtLettersA');
    });

    it('should display No-copays-or-debts alert - C17928', () => {
      cy.visit('/manage-debt-and-bills/summary');
      cy.wait(['@features', '@copaysA', '@debtsA', '@debtLettersA']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-combo-alert-zero').should('exist');

      cy.injectAxeThenAxeCheck('#react-root');
    });
  });

  context('User has Copays only', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/medical_copays', mockCopays).as('copaysB');
      cy.intercept('GET', '/v0/debts', mockDebtsEmpty).as('debtsB');
      cy.intercept('GET', '/v0/debt_letters', mockDataEmpty).as('debtLettersB');
    });

    it('should display Copay summary-card & No-debts alert - C17929', () => {
      cy.visit('/manage-debt-and-bills/summary');
      cy.wait(['@features', '@copaysB', '@debtsB', '@debtLettersB']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-copay')
        .should('exist')
        .within(() => {
          cy.findByTestId('card-amount')
            .invoke('text')
            .should('contain', '61.00');
        });
      cy.findByTestId('balance-card-zero-debt').should('exist');

      cy.injectAxeThenAxeCheck('#react-root');
    });

    /* eslint-disable @department-of-veterans-affairs/axe-check-required */
    // Overview-page already AXE-checked in a previous test.
    it('should navigate to Copay-list page - C18020', () => {
      cy.visit('/manage-debt-and-bills/summary');
      cy.wait(['@features', '@copaysB', '@debtsB', '@debtLettersB']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-copay')
        .findByTestId('card-link')
        .click();
      cy.url().should('match', /\/copay-balances$/);
    });
    /* eslint-enable @department-of-veterans-affairs/axe-check-required */
  });

  context('User has Debts only', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/medical_copays', mockDataEmpty).as('copaysC');
      cy.intercept('GET', '/v0/debts', mockDebts).as('debtsC');
      cy.intercept('GET', '/v0/debt_letters', mockDataEmpty).as('debtLettersC');
    });

    it('should display No-Copays alert & Debt summary-card - C18021', () => {
      cy.visit('/manage-debt-and-bills/summary');
      cy.wait(['@features', '@copaysC', '@debtsC', '@debtLettersC']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-zero-copay').should('exist');
      cy.findByTestId('balance-card-debt')
        .should('exist')
        .within(() => {
          cy.findByTestId('card-amount')
            .invoke('text')
            .should('contain', '3,305.40');
        });

      cy.injectAxeThenAxeCheck('#react-root');
    });

    /* eslint-disable @department-of-veterans-affairs/axe-check-required */
    // Overview-page already AXE-checked in a previous test.
    it('should navigate to Debt-list page - C18022', () => {
      cy.visit('/manage-debt-and-bills/summary');
      cy.wait(['@features', '@copaysC', '@debtsC', '@debtLettersC']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-debt')
        .findByTestId('card-link')
        .click();
      cy.url().should('match', /\/debt-balances$/);
    });
    /* eslint-enable @department-of-veterans-affairs/axe-check-required */
  });

  context('User has both Copays and Debts', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/medical_copays', mockCopays).as('copaysD');
      cy.intercept('GET', '/v0/debts', mockDebts).as('debtsD');
      cy.intercept('GET', '/v0/debt_letters', mockDataEmpty).as('debtLettersD');
    });

    it('should display Copay and Debt summary-cards - C18023', () => {
      cy.visit('/manage-debt-and-bills/summary');
      cy.wait(['@features', '@copaysD', '@debtsD', '@debtLettersD']);
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

    /* eslint-disable @department-of-veterans-affairs/axe-check-required */
    // Overview-page already AXE-checked in a previous test.
    it('should navigate to Copay-list & Debt-list pages - C18024', () => {
      cy.visit('/manage-debt-and-bills/summary');
      cy.wait(['@features', '@copaysD', '@debtsD', '@debtLettersD']);
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
    });
    /* eslint-enable @department-of-veterans-affairs/axe-check-required */
  });
});
