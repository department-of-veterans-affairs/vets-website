import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockCopays from './fixtures/mocks/copays.json';
import mockUser from './fixtures/mocks/mock-user.json';

describe('Medical Copays', () => {
  const id = 'f4385298-08a6-42f8-a86f-50e97033fb85';

  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', mockCopays);
    cy.visit('/health-care/pay-copay-bill/your-current-balances/');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('displays copay balances', () => {
    cy.findAllByText(/Your current copay balances/i).should('exist');
    cy.findByTestId(`balance-card-${id}`).should('exist');
    cy.findByTestId(`amount-${id}`).contains('$15.00');
    cy.findByTestId(`facility-city-${id}`).contains(
      'Ralph H. Johnson Department of Veterans Affairs Medical Center',
    );
  });

  it('navigates to the detail page', () => {
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId(`updated-date`).contains('November 15, 2019');
  });

  it('download statements', () => {
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId(`download-statements`).should('exist');
    cy.findAllByText(/June 13, 2021 statement/i).should('exist');
  });
});
