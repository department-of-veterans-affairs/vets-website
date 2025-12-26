import mockFeatureToggles from '../../../combined/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockUser from '../../../combined/tests/e2e/fixtures/mocks/mock-user-81.json';
import {
  copayResponses,
  debtResponses,
} from '../../../combined/tests/e2e/helpers/cdp-helpers';

describe('CDP - Debt Balances Page Diary Codes', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    debtResponses.good('debts');
    copayResponses.good('copays');
    cy.visit('/manage-va-debt/summary/debt-balances');
    cy.wait(['@copays', '@debts', '@features']);
  });

  it('renders expected content for diary code: 080, 850, 852, 860, 855', () => {
    // Get Summary Card & navigate to it's details page
    cy.contains(
      '[data-testid="debt-summary-item"]',
      'Contact the U.S. Department of the Treasury’s Debt Management Services at',
    )
      .find('va-link')
      .click({ waitForAnimations: true });
    // Get Alert's Children
    cy.get('va-alert').as('alert-content');
    // Check Alert Header
    cy.get('@alert-content')
      .find('h2')
      .contains(
        'Contact the U.S. Department of the Treasury to pay this $110.00 debt',
      );
    // Assert no links are rendered for these diary codes
    cy.get('@alert-content')
      .find('va-link, a')
      .should('have.length', 0);
    cy.injectAxeThenAxeCheck();
  });

  it('renders expected content for diary code: 100, 102, 130, 140', () => {
    cy.contains(
      '[data-testid="debt-summary-item"]',
      'Pay your $120.40 balance now or request help by October 18, 2012',
    )
      .findByTestId('debt-details-link')
      .click({ waitForAnimations: true });
    cy.get('va-alert').as('alert-content');
    cy.get('@alert-content')
      .find('h2')
      .contains(
        'Pay your $120.40 balance now or request help by October 18, 2012',
      );
    cy.get('@alert-content')
      .find('[data-testid="link-resolve"]')
      .should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('renders expected content for diary code: 101, 450, 602, 607, 608, 610, 611, 614, 615, 617', () => {
    cy.contains(
      '[data-testid="debt-summary-item"]',
      'We’re reducing your benefit payments each month until your debt is paid',
    )
      .findByTestId('debt-details-link')
      .click({ waitForAnimations: true });
    cy.injectAxeThenAxeCheck();
  });

  it('renders expected content for diary code: 117', () => {
    cy.contains(
      '[data-testid="debt-summary-item"]',
      'Pay your $1,000.00 past due balance in full or request help before May 31, 2017',
    )
      .findByTestId('debt-details-link')
      .click({ waitForAnimations: true });
    cy.get('va-alert').as('alert-content');
    cy.get('@alert-content')
      .find('h2')
      .contains(
        `Pay your $1,000.00 balance in full or request help by May 31, 2017`,
      );
    cy.get('@alert-content')
      .find('[data-testid="link-resolve"]')
      .should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('renders expected content for diary code: 123', () => {
    cy.contains(
      '[data-testid="debt-summary-item"]',
      'Pay your $200.00 past due balance now or request help by October 7, 2018',
    )
      .findByTestId('debt-details-link')
      .click({ waitForAnimations: true });
    cy.get('va-alert').as('alert-content');
    cy.get('@alert-content')
      .find('h2')
      .contains(
        `Pay your $200.00 balance now or request help by October 7, 2018`,
      );
    cy.get('@alert-content')
      .find('[data-testid="link-resolve"]')
      .should('exist');
    cy.injectAxeThenAxeCheck();
  });
});
