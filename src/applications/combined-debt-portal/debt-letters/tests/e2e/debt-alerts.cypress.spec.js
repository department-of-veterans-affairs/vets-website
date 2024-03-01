import mockDebts from './fixtures/mocks/debts.json';
import mockUser from './fixtures/mocks/mock-user.json';
import mockCopays from '../../../medical-copays/tests/e2e/fixtures/mocks/copays.json';
import mockDebtVBMS from './fixtures/mocks/debtsVBMS.json';

beforeEach(() => {
  cy.intercept('GET', '/v0/feature_toggles*', {
    data: {
      features: [
        { name: 'debt_letters_show_letters', value: true },
        { name: 'combined_debt_portal_access', value: true },
        { name: 'debt_letters_show_letters_vbms', value: true },
      ],
    },
  });
});

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
    cy.intercept('GET', '/v0/debts', mockDebts).as('debts');
    cy.intercept('GET', '/v0/debt_letters', mockDebtVBMS).as('debtVBMS');
    cy.intercept('GET', '/v0/medical_copays', mockCopays).as('copays');
    cy.visit('/manage-va-debt/summary/debt-balances');
    cy.wait(['@copays', '@debts', '@debtVBMS']);
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
    cy.login(mockUser);
    cy.intercept('GET', '/v0/debts', mockDebts).as('debts');
    cy.intercept('GET', '/v0/debt_letters', mockDebtVBMS).as('debtVBMS');
    cy.intercept('GET', '/v0/medical_copays', req => {
      req.reply(404, { errors: ['error'] });
    }).as('copays');
    cy.visit('/manage-va-debt/summary/debt-balances');
    cy.wait(['@copays', '@debts', '@debtVBMS']);
    // Page load
    cy.findByTestId('summary-page-title').should('exist');
    // No large alert
    cy.findByTestId('current-va-debt-list').should('exist');
    // copay alert other VA section
    cy.findByTestId('error-copay-alert').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  // VHA && VBA endpoints 404
  it('should display alert error message for VBA & VHA 404 responses', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/debts', req => {
      req.reply(404, { errors: ['error'] });
    }).as('debts');
    cy.intercept('GET', '/v0/medical_copays', req => {
      req.reply(404, { errors: ['error'] });
    }).as('copays');
    cy.visit('/manage-va-debt/summary/debt-balances');
    cy.wait(['@copays', '@debts']);
    // Page load
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId('current-va-debt-list').should('not.exist');
    // Alerts
    cy.findByTestId('all-error-alert').should('exist');
    // Check for potential bogus alerts
    cy.findByTestId('ther-va-debts-head').should('not.exist');
    cy.findByTestId('error-copay-alert').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });

  // // VBA endpoint 404s & VHA has balance
  it('should display alert error message for VBA 404 response with Your Other VA section', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/debts', req => {
      req.reply(404, { errors: ['error'] });
    }).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockCopays).as('copays');
    cy.visit('/manage-va-debt/summary/debt-balances');
    cy.wait(['@copays', '@debts']);
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
    cy.login(mockUser);
    cy.intercept('GET', '/v0/debts', req => {
      req.reply(404, {});
    }).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockZeroCopay).as('copays');
    cy.visit('/manage-va-debt/summary/debt-balances');
    cy.wait(['@copays', '@debts']);
    // Page load
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId('current-va-debt-list').should('not.exist');
    // Alerts
    cy.findByTestId('error-debt-alert').should('exist');
    cy.findByTestId('other-va-copay-body').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });

  // // VBA 0 balance & VHA balance
  it('should display alert info message for 0 VBA balance with Your Other VA secion', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/debts', mockZeroDebt).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockCopays).as('copays');
    cy.visit('/manage-va-debt/summary/debt-balances');
    cy.wait(['@copays', '@debts']);
    // Page load
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId('current-va-debt-list').should('not.exist');
    // Alerts
    cy.findByTestId('zero-debt-alert').should('exist');
    cy.findByTestId('other-va-copay-body').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  // // VBA & VHA 0 balance
  it('should display alert info message for 0 VBA balance without Your Other VA secion', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/debts', mockZeroDebt).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockZeroCopay).as('copays');
    cy.visit('/manage-va-debt/summary/debt-balances');
    cy.wait(['@copays', '@debts']);
    // Page Load
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId('current-va-debt-list').should('not.exist');
    // Alerts
    cy.findByTestId('zero-debt-alert').should('exist');
    cy.findByTestId('other-va-copay-body').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
