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
      '[data-testid^="summary-card-"]',
      'Call the U.S. Treasury at 888-826-3127 to resolve this balance.',
    )
      .findByTestId('link-details')
      .click({ waitForAnimations: true });
    // Get Alert's Children
    cy.get('va-alert').as('alert-content');
    // Check Alert Header
    cy.get('@alert-content')
      .find('h2')
      .contains('Call the U.S. Treasury to resolve this balance');
    // Assert no links are rendered for these diary codes
    cy.get('@alert-content')
      .findByTestId('link-details')
      .should('have.length', 1);
    cy.injectAxeThenAxeCheck();
  });

  it('renders expected content for diary code: 100, 102, 117, 123, 130, 140', () => {
    cy.contains(
      '[data-testid^="summary-card-"]',
      'Pay your balance of $120.40 or request help by November 17, 2012 to avoid any collection actions',
    )
      .findByTestId('link-details')
      .click({ waitForAnimations: true });
    cy.get('va-alert').as('alert-content');
    cy.get('@alert-content')
      .find('h2')
      .contains('Pay your balance now to avoid collection');
    cy.get('@alert-content')
      .findByTestId('link-resolve')
      .should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('renders expected content for diary code: 101, 450, 602, 607, 608, 610, 611, 614, 615, 617', () => {
    cy.contains(
      '[data-testid^="summary-card-"]',
      "We're reducing your monthly VA benefit payments to repay your overdue balance",
    )
      .findByTestId('link-details')
      .click({ waitForAnimations: true });
    cy.injectAxeThenAxeCheck();
  });

  it('renders expected content for diary code: 61', () => {
    cy.contains(
      '[data-testid^="summary-card-"]',
      "We've paused collection on this balance at your request.",
    )
      .findByTestId('link-details')
      .click({ waitForAnimations: true });
    cy.get('va-alert').as('alert-content');
    cy.get('@alert-content')
      .find('h2')
      .contains(`Collection currently paused`);
    cy.get('@alert-content')
      .findByTestId('link-resolve')
      .should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('renders expected content for diary code: 212', () => {
    cy.contains(
      '[data-testid^="summary-card-"]',
      'Call us to update your address on file.',
    )
      .findByTestId('link-details')
      .click({ waitForAnimations: true });
    cy.get('va-alert').as('alert-content');
    cy.get('@alert-content')
      .find('h2')
      .contains(`Call us to update your address on file`);

    cy.get('@alert-content')
      .find('va-telephone')
      .should('have.length', 2);

    cy.get('@alert-content')
      .find('va-telephone[international="false"]')
      .should('have.attr', 'contact', '800-827-0648');

    cy.get('@alert-content')
      .find('va-telephone[international="true"]')
      .should('have.attr', 'contact', '612-713-6415');
    cy.injectAxeThenAxeCheck();
  });
});
