/**
 * [TestRail-integrated] Spec for Medical Copays
 * @testrailinfo projectId 7
 * @testrailinfo suiteId 8
 * @testrailinfo groupId 3090
 * @testrailinfo runName MCP-e2e-Statements
 */
import mockFeatureToggles from './fixtures/mocks/statement-feature-toggles.json';
import mockUser from './fixtures/mocks/mock-user.json';
import {
  copayResponses,
  debtResponses,
} from '../../../combined/tests/e2e/helpers/cdp-helpers';

describe('CDP - Copay card content', () => {
  const id = 'f4385298-08a6-42f8-a86f-50e97033fb85';

  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    debtResponses.good('debts');
    copayResponses.good('copays');
    cy.visit('/manage-va-debt/summary/copay-balances');

    // Page load
    cy.wait(['@copays', '@debts', '@features']);
    cy.findByTestId('summary-page-title').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('displays copay balances - C12576', () => {
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId(`balance-card-${id}`).should('exist');
    cy.findByTestId(`amount-${id}`).contains('$15.00');
    cy.findByTestId(`facility-city-${id}`).contains(
      'Ralph H. Johnson Department of Veterans Affairs Medical Center',
    );
    cy.injectAxeThenAxeCheck();
  });

  it('displays other va debts', () => {
    cy.findByTestId('other-va-debt-body').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('navigates to the detail page - C12577', () => {
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId('detail-page-title').should('exist');
    cy.findByTestId(`how-to-pay`).contains('How to pay your copay bill');
    cy.injectAxeThenAxeCheck();
  });

  it('displays view statements section - C12578', () => {
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId('detail-page-title').should('exist');
    cy.findByTestId(`view-statements`).should('exist');
    cy.findByTestId(`balance-details-${id}-statement-view`).should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('navigates to view statements page - C12579', () => {
    // get to page
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId('detail-page-title').should('exist');
    cy.findByTestId(`view-statements`).should('exist');
    cy.findByTestId(`balance-details-${id}-statement-view`).click();
    // on page
    cy.findByTestId('statement-page-title').should('exist');
    cy.findByTestId(`facility-name`).contains(
      'Ralph H. Johnson Department of Veterans Affairs Medical Center',
    );
    cy.injectAxeThenAxeCheck();
  });

  it('displays account summary - C12580', () => {
    // get to page
    cy.findByTestId('summary-page-title').should('exist');
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
    cy.injectAxeThenAxeCheck();
  });
});
