import mockFeatureToggles from '../../../combined/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockUser from '../../../combined/tests/e2e/fixtures/mocks/mock-user-81.json';
import {
  copayResponses,
  debtResponses,
} from '../../../combined/tests/e2e/helpers/cdp-helpers';

describe('CDP - VHA Copay Alerts', () => {
  const id = 'f4385298-08a6-42f8-a86f-50e97033fb85';
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
  });

  describe('Copay Balances Page - copays ok', () => {
    beforeEach(() => {
      copayResponses.good('copays');
    });
    // Has both VHA and VBA balances
    it('should display valid copay balances & other VA debt information', () => {
      debtResponses.good('debts');
      cy.visit('/manage-va-debt/summary/copay-balances');
      cy.wait(['@copays', '@debts', '@features']);

      cy.findByTestId('summary-page-title').should('exist');
      cy.findByTestId(`balance-card-${id}`).should('exist');
      cy.findByTestId(`amount-${id}`).contains('$15.00');
      cy.findByTestId(`facility-city-${id}`).contains(
        'Ralph H. Johnson Department of Veterans Affairs Medical Center',
      );
      cy.findByTestId('other-va-debt-body').should('exist');
      cy.injectAxeThenAxeCheck();
    });

    // Has VHA and VBA 404
    it('should display valid copay balances & other VA debt information', () => {
      debtResponses.bad('debts');
      cy.visit('/manage-va-debt/summary/copay-balances');
      cy.wait(['@copays', '@debts', '@features']);

      cy.findByTestId('summary-page-title').should('exist');
      cy.findByTestId(`balance-card-${id}`).should('exist');
      cy.findByTestId(`amount-${id}`).contains('$15.00');
      cy.findByTestId(`facility-city-${id}`).contains(
        'Ralph H. Johnson Department of Veterans Affairs Medical Center',
      );
      cy.findByTestId('other-va-debt-body').should('not.exist');
      cy.findByTestId('error-debt-alert').should('exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Copay Balances Page - copays 404', () => {
    beforeEach(() => {
      copayResponses.bad('copays');
    });
    // VHA && VBA 404
    it('should display alert error message for VBA & VHA 404 responses', () => {
      debtResponses.bad('debts');
      cy.visit('/manage-va-debt/summary/copay-balances');
      cy.wait(['@copays', '@debts', '@features']);

      cy.findByTestId('summary-page-title').should('exist');
      cy.findByTestId('all-error-alert').should('exist');
      cy.findByTestId('other-va-debt-body').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });

    // VHA 404 & VBA balance
    it('should display alert error message for VHA 404 response and Your Other VA section', () => {
      debtResponses.good('debts');
      cy.visit('/manage-va-debt/summary/copay-balances');
      cy.wait(['@copays', '@debts', '@features']);

      cy.findByTestId('summary-page-title').should('exist');
      cy.findByTestId('error-copay-alert').should('exist');
      cy.findByTestId('other-va-debt-body').should('exist');
      cy.injectAxeThenAxeCheck();
    });

    // VHA 404 & VBA 0 balance
    it('should display alert error message for VHA 404 response and no Your Other VA section', () => {
      debtResponses.empty('debts');
      cy.visit('/manage-va-debt/summary/copay-balances');
      cy.wait(['@copays', '@debts', '@features']);

      cy.findByTestId('summary-page-title').should('exist');
      cy.findByTestId('error-copay-alert').should('exist');
      cy.findByTestId('other-va-debt-body').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Copay Balances Page - Copays empty', () => {
    beforeEach(() => {
      copayResponses.empty('copays');
    });
    // VHA 0 balance & VBA balance
    it('should display alert info message for 0 VHA balance and Your Other VA secion ', () => {
      debtResponses.good('debts');
      cy.visit('/manage-va-debt/summary/copay-balances');
      cy.wait(['@copays', '@debts', '@features']);

      cy.findByTestId('summary-page-title').should('exist');
      cy.findByTestId('zero-copay-alert').should('exist');
      cy.findByTestId('other-va-debt-body').should('exist');
      cy.injectAxeThenAxeCheck();
    });

    // VHA & VBA 0 balance
    it('should display alert info message for 0 VHA balance and no Your Other VA secion', () => {
      debtResponses.empty('debts');
      cy.visit('/manage-va-debt/summary/copay-balances');
      cy.wait(['@copays', '@debts', '@features']);

      cy.findByTestId('summary-page-title').should('exist');
      cy.findByTestId('zero-copay-alert').should('exist');
      cy.findByTestId('other-va-debt-body').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Copay Balances Page - Not enrolled in healthcare', () => {
    beforeEach(() => {
      copayResponses.notEnrolled('copays');
    });

    // VHA 403 response (Not enrolled in healthcare)
    it('should display not enrolled in healthcare alert for VHA 403 response', () => {
      debtResponses.good('debts');
      cy.visit('/manage-va-debt/summary/copay-balances');
      cy.wait(['@copays', '@debts', '@features']);

      // Ensure the page has loaded
      cy.findByTestId('summary-page-title').should('exist');

      // Check for the "not enrolled in healthcare" alert
      cy.findByTestId('copay-no-health-care-alert').should('exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});
