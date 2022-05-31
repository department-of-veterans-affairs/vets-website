/**
 * [TestRail-integrated] Spec for Medical Copays
 * @testrailinfo projectId 7
 * @testrailinfo suiteId 8
 * @testrailinfo groupId 3090
 * @testrailinfo runName MCP-e2e-Statements
 */
import mockDebt from '../../utils/mocks/debts.json';
import mockFeatureToggles from './fixtures/mocks/statement-feature-toggles.json';
import mockCopays from './fixtures/mocks/copays.json';
import mockUser from './fixtures/mocks/mock-user.json';

describe('Medical Copays', () => {
  const id = 'f4385298-08a6-42f8-a86f-50e97033fb85';

  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/medical_copays', mockCopays);
    cy.intercept('GET', '/v0/debts', mockDebt);
    cy.visit('/health-care/pay-copay-bill/your-current-balances/');
    cy.findByTestId('overview-page-title').should('exist');
    cy.injectAxe();
  });

  it('displays copay balances - C12576', () => {
    cy.findByTestId('overview-page-title').should('exist');
    cy.findByTestId(`balance-card-${id}`).should('exist');
    cy.findByTestId(`amount-${id}`).contains('$15.00');
    cy.findByTestId(`facility-city-${id}`).contains(
      'Ralph H. Johnson Department of Veterans Affairs Medical Center',
    );
    cy.axeCheck();
  });

  it('displays other va debts', () => {
    cy.findByTestId('other-va-debt-body').should('exist');
    cy.axeCheck();
  });

  it('navigates to the detail page - C12577', () => {
    cy.findByTestId('overview-page-title').should('exist');
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId('detail-page-title').should('exist');
    cy.findByTestId(`updated-date`).contains('November 15, 2019');
    cy.findByTestId(`past-due-balance-alert`).contains(
      'Your balance may be overdue',
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
    cy.axeCheck();
  });

  it('displays view statements section - C12578', () => {
    cy.findByTestId('overview-page-title').should('exist');
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId('detail-page-title').should('exist');
    cy.findByTestId(`view-statements`).should('exist');
    cy.findByTestId(`balance-details-${id}-statement-view`).should('exist');
    cy.axeCheck();
  });

  it('navigates to view statements page - C12579', () => {
    // get to page
    cy.findByTestId('overview-page-title').should('exist');
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId('detail-page-title').should('exist');
    cy.findByTestId(`view-statements`).should('exist');
    cy.findByTestId(`balance-details-${id}-statement-view`).click();
    // on page
    cy.findByTestId('statement-page-title').should('exist');
    cy.findByTestId(`facility-name`).contains(
      'Ralph H. Johnson Department of Veterans Affairs Medical Center',
    );
    cy.axeCheck();
  });

  it('displays account summary - C12580', () => {
    // get to page
    cy.findByTestId('overview-page-title').should('exist');
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId('detail-page-title').should('exist');
    cy.findByTestId(`view-statements`).should('exist');
    cy.findByTestId(`balance-details-${id}-statement-view`).click();
    // on page
    cy.findByTestId('account-summary-head').should('exist');
    cy.findByTestId('account-summary-date').contains(
      'Current balance as of November 15',
    );
    cy.findByTestId('account-summary-current').contains('$15.00');
    cy.findByTestId('account-summary-previous').contains(
      'Previous balance: $135.00',
    );
    cy.findByTestId('account-summary-credits').contains(
      'Payments received: $135.00',
    );
    cy.findByTestId('account-summary-new-charges').contains(
      'New charges: $15.00',
    );
    cy.axeCheck();
  });
});
