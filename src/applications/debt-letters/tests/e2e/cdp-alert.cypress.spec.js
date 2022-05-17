import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockDebts from './fixtures/mocks/debts.json';
import mockUser from './fixtures/mocks/mock-user.json';
import mockCopays from '../../../medical-copays/tests/e2e/fixtures/mocks/copays.json';

describe('Debt Letters - CDP Alerts', () => {
  const mockZeroDebt = {
    debts: [],
  };
  const mockZeroCopay = {
    data: [],
  };

  // Has both VBA and VHA balances
  it('displays the current debts section and Your Other VA section', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    cy.intercept('GET', '/v0/debts', mockDebts).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockCopays);
    cy.visit('/manage-va-debt/your-debt/');
    cy.wait(['@features', '@debts']);
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId('other-va-copay-body').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  // Has VBA and VHA 404
  it('displays the current debts section and alert in Your Other VA section', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    cy.intercept('GET', '/v0/debts', mockDebts).as('debts');
    cy.intercept('GET', '/v0/medical_copays', req => {
      req.reply(404, {});
    });
    cy.visit('/manage-va-debt/your-debt/');
    cy.wait(['@features', '@debts']);
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId('error-copay-alert').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  // VHA && VBA 404
  it('should display alert error message for VBA & VHA 404 responses', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    cy.intercept('GET', '/v0/debts', req => {
      req.reply(404, {});
    }).as('debts');
    cy.intercept('GET', '/v0/medical_copays', req => {
      req.reply(404, {});
    });
    cy.visit('/manage-va-debt/your-debt/');
    cy.wait(['@features', '@debts']);
    cy.findByTestId('summary-page-title').should('exist');
    // Alerts
    cy.findByTestId('all-error-alert').should('exist');
    cy.findByTestId('other-va-copay-body').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });

  // VBA 404 & VHA balance
  it('should display alert error message for VBA 404 response and Your Other VA section', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    cy.intercept('GET', '/v0/debts', req => {
      req.reply(404, {});
    }).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockCopays);
    cy.visit('/manage-va-debt/your-debt/');
    cy.wait(['@features', '@debts']);
    cy.findByTestId('summary-page-title').should('exist');
    // Alerts
    cy.findByTestId('error-debt-alert').should('exist');
    cy.findByTestId('other-va-copay-body').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  // VBA 404 & VHA 0 balance
  it('should display alert error message for VBA 404 response and no Your Other VA section', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    cy.intercept('GET', '/v0/debts', req => {
      req.reply(404, {});
    }).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockZeroCopay);
    cy.visit('/manage-va-debt/your-debt/');
    cy.wait(['@features', '@debts']);
    cy.findByTestId('summary-page-title').should('exist');
    // Alerts
    cy.findByTestId('error-debt-alert').should('exist');
    cy.findByTestId('other-va-copay-body').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });

  // VBA 0 balance & VHA balance
  it('should display alert info message for 0 VBA balance and Your Other VA secion', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    cy.intercept('GET', '/v0/debts', mockZeroDebt).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockCopays);
    cy.visit('/manage-va-debt/your-debt/');
    cy.wait(['@features', '@debts']);
    cy.findByTestId('summary-page-title').should('exist');
    // Alerts
    cy.findByTestId('zero-debt-alert').should('exist');
    cy.findByTestId('other-va-copay-body').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  // VBA & VHA 0 balance
  it('should display alert info message for 0 VBA balance and no Your Other VA secion', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    cy.intercept('GET', '/v0/debts', mockZeroDebt).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockZeroCopay);
    cy.visit('/manage-va-debt/your-debt/');
    cy.wait(['@features', '@debts']);
    cy.findByTestId('summary-page-title').should('exist');
    // Alerts
    cy.findByTestId('zero-debt-alert').should('exist');
    cy.findByTestId('other-va-copay-body').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
