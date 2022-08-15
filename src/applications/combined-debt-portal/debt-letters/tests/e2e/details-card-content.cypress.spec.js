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
    // Get Summary Card & navigate to it's details page
    cy.contains(
      '[data-testid="debt-summary-item"]',
      'Contact the U.S. Department of the Treasury to pay this debt',
    )
      .find('a')
      .click({ waitForAnimations: true });
    // Get Alert's Children
    cy.get('va-alert').as('alert-content');
    // Check Alert Header
    cy.get('@alert-content')
      .find('h2')
      .contains(
        'Contact the U.S. Department of the Treasury to pay this $110.00 debt',
      );
    // Check alert has correct links
    cy.get('@alert-content')
      .find('[data-testid="link-make-payment"]')
      .should('exist');
    cy.get('@alert-content')
      .find('[data-testid="link-request-help"]')
      .should('exist');
    cy.axeCheck();
  });

  it('renders expected content for diary code: 100, 102, 130, 140', () => {
    cy.contains(
      '[data-testid="debt-summary-item"]',
      'Pay your $120.40 balance now or request help by October 18, 2012',
    )
      .find('a')
      .click({ waitForAnimations: true });
    cy.get('va-alert').as('alert-content');
    cy.get('@alert-content')
      .find('h2')
      .contains(
        'Pay your $120.40 balance now or request help by October 18, 2012',
      );
    cy.get('@alert-content')
      .find('[data-testid="link-make-payment"]')
      .should('exist');
    cy.get('@alert-content')
      .find('[data-testid="link-request-help"]')
      .should('exist');
    cy.axeCheck();
  });

  it('renders expected content for diary code: 101, 450, 602, 607, 608, 610, 611, 614, 615, 617', () => {
    cy.contains(
      '[data-testid="debt-summary-item"]',
      'We’re offsetting your benefit payments each month until your debt is paid',
    )
      .find('a')
      .click({ waitForAnimations: true });
    cy.get('va-alert').as('alert-content');
    cy.get('@alert-content')
      .find('h2')
      .contains(
        `We're offsetting your benefit payments each month until your debt is paid`,
      );
    cy.get('@alert-content')
      .find('[data-testid="link-make-payment"]')
      .should('not.exist');
    cy.get('@alert-content')
      .find('[data-testid="link-request-help"]')
      .should('not.exist');
    cy.axeCheck();
  });

  it('renders expected content for diary code: 117', () => {
    cy.contains(
      '[data-testid="debt-summary-item"]',
      'Pay your $1,000.00 past due balance in full or request help before May 31, 2017',
    )
      .find('a')
      .click({ waitForAnimations: true });
    cy.get('va-alert').as('alert-content');
    cy.get('@alert-content')
      .find('h2')
      .contains(
        `Pay your $1,000.00 balance in full or request help by May 31, 2017`,
      );
    cy.get('@alert-content')
      .find('[data-testid="link-make-payment"]')
      .should('exist');
    cy.get('@alert-content')
      .find('[data-testid="link-request-help"]')
      .should('exist');
    cy.axeCheck();
  });

  it('renders expected content for diary code: 123', () => {
    cy.contains(
      '[data-testid="debt-summary-item"]',
      'Pay your $200.00 past due balance now or request help by October 7, 2018',
    )
      .find('a')
      .click({ waitForAnimations: true });
    cy.get('va-alert').as('alert-content');
    cy.get('@alert-content')
      .find('h2')
      .contains(
        `Pay your $200.00 balance now or request help by October 7, 2018`,
      );
    cy.get('@alert-content')
      .find('[data-testid="link-make-payment"]')
      .should('exist');
    cy.get('@alert-content')
      .find('[data-testid="link-request-help"]')
      .should('exist');
    cy.axeCheck();
  });
});
