/**
 * [TestRail-integrated] Spec for Medical Copays
 * @testrailinfo projectId 7
 * @testrailinfo suiteId 8
 * @testrailinfo groupId 3090
 * @testrailinfo runName MCP-e2e-Main
 */
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockUser from './fixtures/mocks/mock-user.json';
import {
  copayResponses,
  debtResponses,
} from '../../../combined/tests/e2e/helpers/cdp-helpers';

describe('CDP - Copay generic navigation & content', () => {
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

  it('navigates to the detail page - C12577', () => {
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId('detail-page-title').should('exist');
    cy.findByTestId(`updated-date`).contains('November 15, 2019');
    cy.findByTestId(`past-due-balance-alert`).contains(
      'Your balance may be overdue',
    );
    cy.findByTestId(`how-to-pay`).contains('How to pay your copay bill');
    cy.injectAxeThenAxeCheck();
  });

  it('displays download statements - C12578', () => {
    cy.findByTestId('summary-page-title').should('exist');
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId('detail-page-title').should('exist');
    cy.findByTestId(`view-statements`).should('exist');
    cy.findAllByText(/November 15, 2019/i).should('exist');
    cy.injectAxeThenAxeCheck();
  });
});
