/**
 * [TestRail-integrated] Spec for Medical Copays
 * @testrailinfo projectId 7
 * @testrailinfo suiteId 8
 * @testrailinfo groupId 3090
 * @testrailinfo runName MCP-e2e-Main
 */
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockCopays from './fixtures/mocks/copays.json';
import mockUser from './fixtures/mocks/mock-user.json';

describe('Medical Copays', () => {
  const id = 'f4385298-08a6-42f8-a86f-50e97033fb85';

  before(function() {
    if (Cypress.env('CI')) this.skip();
  });

  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', mockCopays);
    cy.visit('/health-care/pay-copay-bill/your-current-balances/');
    cy.findAllByText(/Your current copay balances/i).should('exist');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('displays copay balances - C12576', () => {
    cy.findAllByText(/Your current copay balances/i).should('exist');
    cy.findByTestId(`balance-card-${id}`).should('exist');
    cy.findByTestId(`amount-${id}`).contains('$15.00');
    cy.findByTestId(`facility-city-${id}`).contains(
      'Ralph H. Johnson Department of Veterans Affairs Medical Center',
    );
  });

  it('navigates to the detail page - C12577', () => {
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId(`updated-date`).contains('November 15, 2019');
    cy.findByTestId(`status-alert`).contains(
      'Pay your $15.00 balance or request help before December 15, 2019',
    );
    cy.findByTestId(`how-to-pay`).contains('How do I pay my VA copay bill?');
    cy.findByTestId(`financial-help`).contains(
      'How do I get financial help for my copays?',
    );
    cy.findByTestId(`dispute-charges`).contains(
      'How do I dispute my copay charges?',
    );
    cy.findByTestId(`balance-questions`).contains(
      'What to do if you have questions about your balance',
    );
  });

  it('displays download statements - C12578', () => {
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId(`download-statements`).should('exist');
    cy.findAllByText(/November 15, 2019/i).should('exist');
  });
});
