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
import { reply404, reply403 } from './helpers/cdp-helpers';

describe('Your VA debt and bills (overview)', () => {
  beforeEach(() => {
    cy.login(mockUser81);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    cy.intercept('GET', '/v0/debt_letters', mockDataEmpty).as('debtLetters');
  });

  context('User has no Copays or Debts', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/medical_copays', mockDataEmpty).as('copaysA');
      cy.intercept('GET', '/v0/debts', mockDebtsEmpty).as('debtsA');
    });

    it('should display No-copays-or-debts alert - C17928', () => {
      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysA', '@debtsA']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-combo-alert-zero').should('exist');

      cy.findByTestId('balance-card-copay').should('not.exist');
      cy.findByTestId('balance-card-debt').should('not.exist');

      cy.injectAxeThenAxeCheck('#react-root');
    });
  });

  context('User has Copays only', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/medical_copays', mockCopays).as('copaysB');
      cy.intercept('GET', '/v0/debts', mockDebtsEmpty).as('debtsB');
    });

    it('should display Copay summary-card & No-debts alert - C17929', () => {
      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysB', '@debtsB']);
      cy.findByTestId('overview-page-title').should('exist');

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

      cy.injectAxeThenAxeCheck('#react-root');
    });

    /* eslint-disable @department-of-veterans-affairs/axe-check-required */
    // Overview-page already AXE-checked in a previous test.
    it('should navigate to Copay-list page - C18020', () => {
      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysB', '@debtsB']);
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
    });

    it('should display No-Copays alert & Debt summary-card - C18021', () => {
      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysC', '@debtsC']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-zero-copay').should('exist');
      cy.findByTestId('balance-card-debt')
        .should('exist')
        .within(() => {
          cy.findByTestId('card-amount')
            .invoke('text')
            .should('contain', '3,305.40');
        });

      cy.findByTestId('balance-card-copay').should('not.exist');
      cy.findByTestId('balance-card-zero-debt').should('not.exist');

      cy.injectAxeThenAxeCheck('#react-root');
    });

    /* eslint-disable @department-of-veterans-affairs/axe-check-required */
    // Overview-page already AXE-checked in a previous test.
    it('should navigate to Debt-list page - C18022', () => {
      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysC', '@debtsC']);
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
    });

    it('should display Copay and Debt summary-cards - C18023', () => {
      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysD', '@debtsD']);
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

      cy.findByTestId('balance-card-zero-copay').should('not.exist');
      cy.findByTestId('balance-card-zero-debt').should('not.exist');

      cy.injectAxeThenAxeCheck('#react-root');
    });

    /* eslint-disable @department-of-veterans-affairs/axe-check-required */
    // Overview-page already AXE-checked in a previous test.
    it('should navigate to Copay-list & Debt-list pages - C18024', () => {
      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysD', '@debtsD']);
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

  context('User is not enrolled in healthcare', () => {
    it('should display not enrolled in healthcare alert', () => {
      cy.intercept('GET', '/v0/medical_copays', req => reply403(req)).as(
        'copaysNE',
      );
      cy.intercept('GET', '/v0/debts', mockDebts).as('debtsNE');

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysNE', '@debtsNE']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('no-healthcare-alert').should('exist');

      cy.injectAxeThenAxeCheck('#react-root');
    });
  });

  context('Error states', () => {
    it('should display Copays error message upon copays API-404-error - C18216', () => {
      cy.intercept('GET', '/v0/medical_copays', req => reply404(req)).as(
        'copaysE1',
      );
      cy.intercept('GET', '/v0/debts', mockDebts).as('debtsE1');

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysE1', '@debtsE1']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-alert-copay').should('exist');

      cy.findByTestId('balance-card-copay').should('not.exist');

      cy.injectAxeThenAxeCheck('#react-root');
    });

    it('should display Debts error message upon debts API-404-error - C18217', () => {
      cy.intercept('GET', '/v0/medical_copays', mockCopays).as('copaysE2');
      cy.intercept('GET', '/v0/debts', req => reply404(req)).as('debtsE2');

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysE2', '@debtsE2']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-alert-debt').should('exist');

      cy.findByTestId('balance-card-debt').should('not.exist');

      cy.injectAxeThenAxeCheck('#react-root');
    });

    /* eslint-disable @department-of-veterans-affairs/axe-check-required */
    // Alerts already AXE-checked in previous 2 tests.
    it('should display Combined error message upon both API-404-errors - C18218', () => {
      cy.intercept('GET', '/v0/medical_copays', req => reply404(req)).as(
        'copaysE3',
      );
      cy.intercept('GET', '/v0/debts', req => reply404(req)).as('debtsE3');

      cy.visit('/manage-va-debt/summary');
      cy.wait(['@features', '@copaysE3', '@debtsE3']);
      cy.findByTestId('overview-page-title').should('exist');

      cy.findByTestId('balance-card-combo-alert-error').should('exist');

      cy.findByTestId('balance-card-copay').should('not.exist');
      cy.findByTestId('balance-card-debt').should('not.exist');
    });
    /* eslint-enable @department-of-veterans-affairs/axe-check-required */
  });
});
