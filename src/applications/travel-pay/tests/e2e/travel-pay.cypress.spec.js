/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { appName, rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';

const testStatuses = [
  'CLAIM_SUBMITTED',
  'SAVED',
  'IN_PROCESS',
  'INCOMPLETE',
  'APPEALED',
  'MANUAL_REVIEW',
  'CLOSED',
  'ON_HOLD',
];

Cypress.Commands.add('openFiltersAndUncheckStatuses', () => {
  cy.get('va-accordion-item[data-testid="filters-accordion"]')
    .shadow()
    .find('h2 button[aria-controls="content"]')
    .eq(0)
    .click({ waitForAnimations: true });
  testStatuses.forEach(status => {
    cy.selectVaCheckbox(`${status}_checkbox`, false);
  });
});

describe(`${appName} -- Status Page`, () => {
  beforeEach(() => {
    cy.intercept('/data/cms/vamc-ehr.json', {});
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
      .should('include.text', ' June 22, 2023');
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
    cy.get('h2[data-testid="travel-claim-details"]')
      .eq(4)
      .should('include.text', 'August 11, 2022');
  });

  it('filters the claims by status and preserves default sort', () => {
    cy.openFiltersAndUncheckStatuses();
    cy.selectVaCheckbox('SAVED_checkbox', true);
    cy.get('va-button[data-testid="apply_filters"]').click({
      waitForAnimations: true,
    });

    cy.get('h2[data-testid="travel-claim-details"]').should('have.length', 5);
    cy.get('h2[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'August 16, 2023');
    cy.get('h2[data-testid="travel-claim-details"]')
      .eq(4)
      .should('include.text', 'March 27, 2022');
  });

  it('filters the claims by multiple statuses and preserves default sort', () => {
    cy.openFiltersAndUncheckStatuses();
    cy.selectVaCheckbox('SAVED_checkbox', true);
    cy.selectVaCheckbox('INCOMPLETE_checkbox', true);
    cy.get('va-button[data-testid="apply_filters"]').click({
      waitForAnimations: true,
    });

    cy.get('h2[data-testid="travel-claim-details"]').should('have.length', 6);
    cy.get('h2[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'May 15, 2024');
    cy.get('h2[data-testid="travel-claim-details"]')
      .eq(5)
      .should('include.text', 'March 27, 2022');
  });

  it('resets the filters when button is pressed', () => {
    cy.openFiltersAndUncheckStatuses();
    cy.selectVaCheckbox('SAVED_checkbox', true);
    cy.get('va-button[data-testid="apply_filters"]').click({
      waitForAnimations: true,
    });
    cy.get('va-button[data-testid="reset_search"]').click({
      waitForAnimations: true,
    });
    cy.get('h2[data-testid="travel-claim-details"]').should('have.length', 10);
    testStatuses.forEach(statusName => {
      cy.get(`va-checkbox[name=${statusName}_checkbox]`)
        .shadow()
        .find('input[type="checkbox"]')
        .should('not.be.checked');
    });
    cy.get('h2[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'May 15, 2024');
  });

  it('preserves sort order when filters are applied', () => {
    cy.get('select[name="claimsOrder"]').select('oldest');
    cy.get('va-button[data-testid="Sort travel claims"]').click();
    cy.openFiltersAndUncheckStatuses();
    cy.selectVaCheckbox('SAVED_checkbox', true);
    cy.get('va-button[data-testid="apply_filters"]').click({
      waitForAnimations: true,
    });
    cy.get('h2[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'March 27, 2022');
    cy.get('h2[data-testid="travel-claim-details"]')
      .eq(4)
      .should('include.text', 'August 16, 2023');
  });
});
