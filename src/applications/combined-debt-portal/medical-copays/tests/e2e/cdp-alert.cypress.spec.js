import mockFeatureToggles from './fixtures/mocks/cdp-alert-feature-toggles.json';
import mockCopays from './fixtures/mocks/copays.json';
import mockUser from './fixtures/mocks/mock-user.json';
import mockDebt from '../../../combined/utils/mocks/mockDebts.json';

describe('Medical Copays - CDP Alerts', () => {
  const id = 'f4385298-08a6-42f8-a86f-50e97033fb85';
  const mockZeroDebt = {
    debts: [],
  };
  const mockZeroCopay = {
    data: [],
  };

  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    cy.intercept('GET', '/v0/debts', mockDebt).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockCopays).as('copays');
    cy.visit('/manage-va-debt/summary/copay-balances');

    // Page load
    cy.wait(['@copays', '@debts', '@features']);
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  // Has both VHA and VBA balances
  it('should display valid copay balances & other VA debt information', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', mockCopays);
    cy.intercept('GET', '/v0/debts', mockDebt);
    cy.visit('/manage-va-debt/summary/copay-balances');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId(`balance-card-${id}`).should('exist');
    cy.findByTestId(`amount-${id}`).contains('$15.00');
    cy.findByTestId(`facility-city-${id}`).contains(
      'Ralph H. Johnson Department of Veterans Affairs Medical Center',
    );
    cy.findByTestId('other-va-debt-body').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  // VHA 403 response (Not enrolled in healthcare)
  it('should display not enrolled in healthcare alert for VHA 403 response', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', req => {
      req.reply(403, {
        errors: [
          {
            title: 'Forbidden',
            detail: 'User does not have access to the requested resource',
            code: '403',
            status: '403',
          },
        ],
      });
    });
    cy.intercept('GET', '/v0/debts', mockDebt);
    cy.visit('/manage-va-debt/summary/copay-balances');

    // Ensure the page has loaded
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();

    // Check for the "not enrolled in healthcare" alert
    cy.findByTestId('no-healthcare-alert').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  // Has VHA and VBA 404
  it('should display valid copay balances & other VA debt information', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', mockCopays);
    cy.intercept('GET', '/v0/debts', req => {
      req.reply(404, { errors: ['error'] });
    });
    cy.visit('/manage-va-debt/summary/copay-balances');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId(`balance-card-${id}`).should('exist');
    cy.findByTestId(`amount-${id}`).contains('$15.00');
    cy.findByTestId(`facility-city-${id}`).contains(
      'Ralph H. Johnson Department of Veterans Affairs Medical Center',
    );
    cy.findByTestId('other-va-debt-body').should('not.exist');
    cy.findByTestId('error-debt-alert').should('exist');
    cy.injectAxeThenAxeCheck();
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
    cy.visit('/manage-va-debt/summary/copay-balances');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId('all-error-alert').should('exist');
    cy.findByTestId('other-va-debt-body').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });

  // VHA 404 & VBA balance
  it('should display alert error message for VHA 404 response and Your Other VA section', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', req => {
      req.reply(404, { errors: ['error'] });
    });
    cy.intercept('GET', '/v0/debts', mockDebt);
    cy.visit('/manage-va-debt/summary/copay-balances');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId('error-copay-alert').should('exist');
    cy.findByTestId('other-va-debt-body').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  // VHA 404 & VBA 0 balance
  it('should display alert error message for VHA 404 response and no Your Other VA section', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', req => {
      req.reply(404, { errors: ['error'] });
    });
    cy.intercept('GET', '/v0/debts', mockZeroDebt);
    cy.visit('/manage-va-debt/summary/copay-balances');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId('error-copay-alert').should('exist');
    cy.findByTestId('other-va-debt-body').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });

  // VHA 0 balance & VBA balance
  it('should display alert info message for 0 VHA balance and Your Other VA secion ', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', mockZeroCopay);
    cy.intercept('GET', '/v0/debts', mockDebt);
    cy.visit('/manage-va-debt/summary/copay-balances');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId('zero-copay-alert').should('exist');
    cy.findByTestId('other-va-debt-body').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  // VHA & VBA 0 balance
  it('should display alert info message for 0 VHA balance and no Your Other VA secion', () => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', mockZeroCopay);
    cy.intercept('GET', '/v0/debts', mockZeroDebt);
    cy.visit('/manage-va-debt/summary/copay-balances');

    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
    cy.findByTestId('zero-copay-alert').should('exist');
    cy.findByTestId('other-va-debt-body').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
