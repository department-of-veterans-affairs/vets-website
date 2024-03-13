import mockFeatureToggles from './fixtures/mocks/cdp-alert-feature-toggles.json';
import mockCopays from './fixtures/mocks/copays.json';
import mockUser from './fixtures/mocks/mock-user.json';
import mockDebt from '../../utils/mocks/debts.json';

describe('Medical Copays - CDP Alerts', () => {
  const id = 'f4385298-08a6-42f8-a86f-50e97033fb85';
  const mockZeroDebt = {
    debts: [],
  };
  const mockZeroCopay = {
    data: [],
  };

  // Has both VHA and VBA balances
  it('should display valid copay balances & other VA debt information', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', mockCopays);
    cy.intercept('GET', '/v0/debts', mockDebt);
    cy.visit('/health-care/pay-copay-bill/your-current-balances/');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId(`balance-card-${id}`).should('exist');
    cy.findByTestId(`amount-${id}`).contains('$15.00');
    cy.findByTestId(`facility-city-${id}`).contains(
      'Ralph H. Johnson Department of Veterans Affairs Medical Center',
    );
    cy.findByTestId('other-va-debt-body').should('exist');
    cy.axeCheck();
  });

  // Has VHA and VBA 404
  it('should display valid copay balances & other VA debt information', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', mockCopays);
    cy.intercept('GET', '/v0/debts', req => {
      req.reply(404, { errors: ['error'] });
    });
    cy.visit('/health-care/pay-copay-bill/your-current-balances/');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId(`balance-card-${id}`).should('exist');
    cy.findByTestId(`amount-${id}`).contains('$15.00');
    cy.findByTestId(`facility-city-${id}`).contains(
      'Ralph H. Johnson Department of Veterans Affairs Medical Center',
    );
    cy.findByTestId('other-va-debt-body').should('not.exist');
    cy.findByTestId('error-debt-alert').should('exist');
    cy.axeCheck();
  });

  // VHA && VBA 404
  it('should display alert error message for VBA & VHA 404 responses', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', req => {
      req.reply(404, { errors: ['error'] });
    });
    cy.intercept('GET', '/v0/debts', req => {
      req.reply(404, { errors: ['error'] });
    });
    cy.visit('/health-care/pay-copay-bill/your-current-balances/');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId('all-error-alert').should('exist');
    cy.findByTestId('other-va-debt-body').should('not.exist');
    cy.axeCheck();
  });

  // VHA 404 & VBA balance
  it('should display alert error message for VHA 404 response and Your Other VA section', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', req => {
      req.reply(404, { errors: ['error'] });
    });
    cy.intercept('GET', '/v0/debts', mockDebt);
    cy.visit('/health-care/pay-copay-bill/your-current-balances/');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId('error-copay-alert').should('exist');
    cy.findByTestId('other-va-debt-body').should('exist');
    cy.axeCheck();
  });

  // VHA 404 & VBA 0 balance
  it('should display alert error message for VHA 404 response and no Your Other VA section', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', req => {
      req.reply(404, { errors: ['error'] });
    });
    cy.intercept('GET', '/v0/debts', mockZeroDebt);
    cy.visit('/health-care/pay-copay-bill/your-current-balances/');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId('error-copay-alert').should('exist');
    cy.findByTestId('other-va-debt-body').should('not.exist');
    cy.axeCheck();
  });

  // VHA 0 balance & VBA balance
  it('should display alert info message for 0 VHA balance and Your Other VA secion ', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', mockZeroCopay);
    cy.intercept('GET', '/v0/debts', mockDebt);
    cy.visit('/health-care/pay-copay-bill/your-current-balances/');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId('zero-copay-alert').should('exist');
    cy.findByTestId('other-va-debt-body').should('exist');
    cy.axeCheck();
  });

  // VHA & VBA 0 balance
  it('should display alert info message for 0 VHA balance and no Your Other VA secion', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', mockZeroCopay);
    cy.intercept('GET', '/v0/debts', mockZeroDebt);
    cy.visit('/health-care/pay-copay-bill/your-current-balances/');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId('zero-copay-alert').should('exist');
    cy.findByTestId('other-va-debt-body').should('not.exist');
    cy.axeCheck();
  });
});
