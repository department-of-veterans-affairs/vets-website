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
    cy.get('[data-testid^="summary-card-"]').contains(
      'Call the U.S. Treasury at 888-826-3127 to resolve this balance.',
    );
    cy.injectAxeThenAxeCheck();
  });

  it('renders expected content for diary code: 100, 102, 130, 140', () => {
    cy.get('[data-testid^="summary-card-"]').contains(
      'Pay your balance of $120.40 or request help by November 17, 2012 to avoid any collection actions.',
    );
    cy.injectAxeThenAxeCheck();
  });

  it('renders expected content for diary code: 101, 450, 602, 607, 608, 610, 611, 614, 615, 617', () => {
    cy.get('[data-testid^="summary-card-"]').contains(
      "We're reducing your monthly VA benefit payments to repay your overdue balance.",
    );
    cy.injectAxeThenAxeCheck();
  });

  it('renders expected content for diary code: 61', () => {
    cy.get('[data-testid^="summary-card-"]').contains(
      "We've paused collection on this balance at your request.",
    );
    cy.injectAxeThenAxeCheck();
  });

  it('renders expected content for diary code: 212', () => {
    cy.get('[data-testid^="summary-card-"]').contains(
      'Call us to update your address on file.',
    );
    cy.injectAxeThenAxeCheck();
  });
});
