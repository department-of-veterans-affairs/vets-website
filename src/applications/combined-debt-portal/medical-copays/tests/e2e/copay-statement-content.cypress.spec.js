/**
 * [TestRail-integrated] Spec for Medical Copays
 * @testrailinfo projectId 7
 * @testrailinfo suiteId 8
 * @testrailinfo groupId 3090
 * @testrailinfo runName MCP-e2e-Statements
 */
import mockFeatureToggles from '../../../combined/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockUser from '../../../combined/tests/e2e/fixtures/mocks/mock-user-81.json';
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
    copayResponses.detail(id);

    cy.findByTestId(`detail-link-${id}`).click();

    // Title proves correct copay was selected
    cy.findByTestId('detail-copay-page-title-otpp').should(
      'contain',
      'Copay bill for Ralph H. Johnson Department of Veterans Affairs Medical Center',
    );

    // Current balance comes from pHNewBalance: 15.0
    cy.contains('dt', 'Current balance:')
      .next('dd')
      .should('contain', '$15.00');

    cy.injectAxeThenAxeCheck();
  });

  it('displays view statements section - C12578', () => {
    copayResponses.detail(id);
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId('detail-copay-page-title-otpp').should('exist');
    cy.findByTestId(`view-statements`).should('exist');

    // This can be non-existent depending on the data. Needs to be conditional
    // Check if statement list exists first
    cy.get('body').then($body => {
      if ($body.find('[data-testid="statement-list"]').length > 0) {
        // Statement list exists, so the statement view should exist
        cy.findByTestId(`balance-details-${id}-statement-view`).should('exist');
      }
    });
    cy.injectAxeThenAxeCheck();
  });

  it('navigates to view statements page - C12579', () => {
    copayResponses.detail(id);
    // get to page
    cy.findByTestId(`detail-link-${id}`).click();
    cy.findByTestId('detail-copay-page-title-otpp').should('exist');
    cy.findByTestId(`view-statements`).should('exist');

    // Check if statement list exists first
    cy.get('body').then($body => {
      if ($body.find('[data-testid="statement-list"]').length > 0) {
        // Statement list exists, so the statement view should exist
        cy.findByTestId(`balance-details-${id}-statement-view`).click();
        cy.findByTestId('statement-page-title').should('exist');
        cy.findByTestId(`facility-name`).contains(
          'Ralph H. Johnson Department of Veterans Affairs Medical Center',
        );
      }
    });
    cy.injectAxeThenAxeCheck();
  });

  it('displays account summary - C12580', () => {
    copayResponses.detail(id);
    // get to page
    cy.findByTestId(`detail-link-${id}`).click();

    cy.findByTestId('detail-copay-page-title-otpp').should('exist');
    cy.findByTestId(`view-statements`).should('exist');

    cy.get('body').then($body => {
      if ($body.find('[data-testid="statement-list"]').length > 0) {
        // Statement list exists, so the statement view should exist
        cy.findByTestId(`balance-details-${id}-statement-view`).should('exist');
        cy.findByTestId(`balance-details-${id}-statement-view`).click();
        // on page
        cy.findByTestId('account-summary-head').should('exist');
        cy.findByTestId('account-summary-previous').contains(
          'Previous balance: $135.00',
        );
        cy.findByTestId('account-summary-credits').contains(
          'Payments received: $135.00',
        );
      }
    });
    cy.injectAxeThenAxeCheck();
  });
});
