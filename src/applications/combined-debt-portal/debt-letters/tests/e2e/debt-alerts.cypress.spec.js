import mockUser from './fixtures/mocks/mock-user.json';
import {
  copayResponses,
  debtResponses,
  vbmsResponses,
} from '../../../combined/tests/e2e/helpers/cdp-helpers';

describe('CDP - VBA Debt Alerts', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'debt_letters_show_letters', value: true },
          { name: 'combined_debt_portal_access', value: true },
          { name: 'debt_letters_show_letters_vbms', value: true },
        ],
      },
    }).as('features');
    cy.visit('/manage-va-debt/summary/debt-balances');
  });

  describe('Debt Balances Page - debts ok', () => {
    beforeEach(() => {
      debtResponses.good('debts');
      vbmsResponses.good('debtVBMS');
    });

    // Has both VBA and VHA balances
    it('displays the current debts section and Your Other VA section', () => {
      copayResponses.good('copays');
      cy.wait(['@copays', '@debts', '@debtVBMS', '@features']);
      // Page load
      cy.findByTestId('summary-page-title').should('exist');
      // No large alert
      cy.findByTestId('current-va-debt-list').should('exist');
      // copay alert other VA section
      cy.findByTestId('other-va-copay-body').should('exist');
      cy.injectAxeThenAxeCheck();
    });

    // Has VBA balances and VHA endpoint 404s
    it('displays the current debts section and alert in Your Other VA section', () => {
      copayResponses.bad('copays');
      cy.wait(['@copays', '@debts', '@debtVBMS', '@features']);
      // Page load
      cy.findByTestId('summary-page-title').should('exist');
      // No large alert
      cy.findByTestId('current-va-debt-list').should('exist');
      // copay alert other VA section
      cy.findByTestId('error-copay-alert').should('exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Debt Balances Page - debts 404', () => {
    beforeEach(() => {
      debtResponses.bad('debts');
      vbmsResponses.bad('debtVBMS');
    });

    // VHA && VBA endpoints 404
    it('should display alert error message for VBA & VHA 404 responses', () => {
      copayResponses.bad('copays');
      cy.wait(['@copays', '@debts', '@features']);
      // Page load
      cy.findByTestId('summary-page-title').should('exist');
      cy.findByTestId('current-va-debt-list').should('not.exist');
      // Alerts
      cy.findByTestId('all-error-alert').should('exist');
      // Check for potential bogus alerts
      cy.findByTestId('other-va-debts-head').should('not.exist');
      cy.findByTestId('error-copay-alert').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });

    // // VBA endpoint 404s & VHA has balance
    it('should display alert error message for VBA 404 response with Your Other VA section', () => {
      copayResponses.good('copays');
      cy.wait(['@copays', '@debts', '@features']);
      // Page load
      cy.findByTestId('summary-page-title').should('exist');
      cy.findByTestId('current-va-debt-list').should('not.exist');
      // Alerts
      cy.findByTestId('error-debt-alert').should('exist');
      cy.findByTestId('other-va-copay-body').should('exist');
      cy.injectAxeThenAxeCheck();
    });

    // // VBA 404 & VHA 0 balance
    it('should display alert error message for VBA 404 response without Your Other VA section', () => {
      copayResponses.empty('copays');
      cy.wait(['@copays', '@debts', '@features']);
      // Page load
      cy.findByTestId('summary-page-title').should('exist');
      cy.findByTestId('current-va-debt-list').should('not.exist');
      // Alerts
      cy.findByTestId('error-debt-alert').should('exist');
      cy.findByTestId('other-va-copay-body').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Debt Balances Page - debts empty', () => {
    beforeEach(() => {
      debtResponses.empty('debts');
      vbmsResponses.empty('debtVBMS');
    });

    // // VBA 0 balance & VHA balance
    it('should display alert info message for 0 VBA balance with Your Other VA section', () => {
      copayResponses.good('copays');
      cy.wait(['@copays', '@debts', '@features']);
      // Page load
      cy.findByTestId('summary-page-title').should('exist');
      cy.findByTestId('current-va-debt-list').should('not.exist');
      // Alerts
      cy.findByTestId('zero-debt-alert').should('exist');
      cy.findByTestId('other-va-copay-body').should('exist');
      cy.injectAxeThenAxeCheck();
    });

    // // VBA & VHA 0 balance
    it('should display alert info message for 0 VBA balance without Your Other VA section', () => {
      copayResponses.empty('copays');
      cy.wait(['@copays', '@debts', '@features']);
      // Page Load
      cy.findByTestId('summary-page-title').should('exist');
      cy.findByTestId('current-va-debt-list').should('not.exist');
      // Alerts
      cy.findByTestId('zero-debt-alert').should('exist');
      cy.findByTestId('other-va-copay-body').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});
