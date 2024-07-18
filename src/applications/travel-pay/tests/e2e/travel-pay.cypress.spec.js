/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import MockDate from 'mockdate';
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

Cypress.Commands.add('openFilters', () => {
  cy.get('va-accordion-item[data-testid="filters-accordion"]')
    .shadow()
    .find('h2 button[aria-controls="content"]')
    .eq(0)
    .click({ waitForAnimations: true });
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

  before(() => {
    MockDate.set('2024-06-25');
  });

  after(() => {
    MockDate.reset();
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
    cy.openFilters();
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
    cy.openFilters();
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

  it('filters the claims by a date range preset', () => {
    cy.openFilters();

    cy.get('select[name="claimsDates"]').should('have.value', 'all');
    cy.get('select[name="claimsDates"]').select('Past 3 Months');
    cy.get('select[name="claimsDates"]').should('have.value', 'Past 3 Months');

    cy.get('va-button[data-testid="apply_filters"]').click({
      waitForAnimations: true,
    });

    cy.get('h2[data-testid="travel-claim-details"]').should('have.length', 1);

    cy.get('h2[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'May 15, 2024');
  });

  it('filters by multiple properties with non-default sorting', () => {
    cy.get('select[name="claimsOrder"]').select('oldest');
    cy.get('select[name="claimsOrder"]').should('have.value', 'oldest');
    cy.get('va-button[data-testid="Sort travel claims"]').click();

    cy.openFilters();
    cy.selectVaCheckbox('CLAIM_SUBMITTED_checkbox', true);
    cy.get('select[name="claimsDates"]').select('All of 2023');
    cy.get('select[name="claimsDates"]').should('have.value', 'All of 2023');

    cy.get('va-button[data-testid="apply_filters"]').click({
      waitForAnimations: true,
    });

    cy.get('h2[data-testid="travel-claim-details"]').should('have.length', 3);
    cy.get('h2[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'May 17, 2023');
    cy.get('h2[data-testid="travel-claim-details"]')
      .eq(2)
      .should('include.text', 'December 28, 2023');
  });

  it('resets the filters when button is pressed', () => {
    cy.openFilters();
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
    cy.openFilters();
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
