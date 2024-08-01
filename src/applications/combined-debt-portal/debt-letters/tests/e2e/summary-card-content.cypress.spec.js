import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockDebts from './fixtures/mocks/debts.json';
import mockUser from './fixtures/mocks/mock-user.json';
import mockCopays from '../../../medical-copays/tests/e2e/fixtures/mocks/copays.json';

describe('Debt Balances Page Diary Codes', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles).as(
      'features',
    );
    cy.intercept('GET', '/v0/debts', mockDebts).as('debts');
    cy.intercept('GET', '/v0/medical_copays', mockCopays).as('copays');
    cy.visit('/manage-va-debt/summary/debt-balances');
    cy.wait(['@copays', '@debts', '@features']);
    cy.injectAxe();
  });

  it('renders expected content for diary code: 080, 850, 852, 860, 855', () => {
    cy.get('[data-testid="debt-summary-item"]').contains(
      // 'Contact the U.S. Department of the Treasury to pay this debt.',
      'Contact the U.S. Department of the Treasury’s Debt Management Services at',
    );
    cy.axeCheck();
  });

  it('renders expected content for diary code: 100, 102, 130, 140', () => {
    cy.get('[data-testid="debt-summary-item"]').contains(
      'Pay your balance now or request help by October 18, 2012',
    );
    cy.axeCheck();
  });

  it('renders expected content for diary code: 101, 450, 602, 607, 608, 610, 611, 614, 615, 617', () => {
    cy.get('[data-testid="debt-summary-item"]').contains(
      'We’re reducing your benefit payments each month until your debt is paid',
    );
    cy.axeCheck();
  });

  it('renders expected content for diary code: 117', () => {
    cy.get('[data-testid="debt-summary-item"]').contains(
      'Pay your $1,000.00 past due balance in full or request help before May 31, 2017',
    );
    cy.axeCheck();
  });

  it('renders expected content for diary code: 123', () => {
    cy.get('[data-testid="debt-summary-item"]').contains(
      'Pay your $200.00 past due balance now or request help by October 7, 2018',
    );
    cy.axeCheck();
  });
});
