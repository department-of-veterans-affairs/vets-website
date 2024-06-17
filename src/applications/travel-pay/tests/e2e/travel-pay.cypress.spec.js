/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { appName, rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';

describe(`${appName} -- Status Page`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeClaims.happyPath();
    cy.login(user);
    cy.visit(rootUrl);
    cy.injectAxeThenAxeCheck();
  });

  it('shows the help text before the claims', () => {
    cy.get('div[slot="content"]')
      .contains('If you need to manage a claim, log into the')
      .parent()
      .siblings()
      .eq(3)
      .should('have.id', 'travel-claims-list');
  });

  it('defaults to "most recent" sort order', () => {
    cy.get('select[name="claimsOrder"]').should('have.value', 'mostRecent');
  });

  it('shows a list of claims ordered by appointment date descending by default', () => {
    cy.get('h2[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'May 15, 2024');

    // Using fifth element to be less susceptible to
    // pagination changes and more confident in terms
    // of correct sort order
    cy.get('h2[data-testid="travel-claim-details"]')
      .eq(4)
      .should('include.text', ' June 21, 2023');
  });

  it('sorts the claims ordered by appointment date ascending on user action', () => {
    cy.get('select[name="claimsOrder"]').should('have.value', 'mostRecent');
    cy.get('select[name="claimsOrder"]').select('oldest');
    cy.get('select[name="claimsOrder"]').should('have.value', 'oldest');

    cy.get('va-button[data-testid="Sort travel claims"]').click();

    cy.get('h2[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'February 2, 2022');

    // Using fifth element to be less susceptible to
    // pagination changes and more confident in terms
    // of correct sort order
    cy.screenshot({ capture: 'viewport' });
    cy.get('h2[data-testid="travel-claim-details"]')
      .eq(4)
      .should('include.text', 'August 11, 2022');
  });

  it('filters the claims by status', () => {
    const statuses = [
      'CLAIM_SUBMITTED',
      'SAVED',
      'IN_PROCESS',
      'INCOMPLETE',
      'APPEALED',
      'MANUAL_REVIEW',
      'CLOSED',
      'ON_HOLD',
    ];
    cy.get('va-accordion-item[data-testid="filters-accordion"]')
      .shadow()
      .find('h2 button[aria-controls="content"]')
      .eq(0)
      .click({ waitForAnimations: true });
    statuses.forEach(status => {
      cy.selectVaCheckbox(`${status}_checkbox`, false);
    });
    cy.selectVaCheckbox('SAVED_checkbox', true);
    cy.get('va-button[data-testid="apply_filters"]').click({
      waitForAnimations: true,
    });

    cy.get('h2[data-testid="travel-claim-details"]').should('have.length', 5);
  });
});
