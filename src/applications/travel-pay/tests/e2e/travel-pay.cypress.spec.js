/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { pageNotFoundTestId } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { appName, rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';

const testStatuses = [
  'Claim submitted',
  'Saved',
  'In process',
  'Incomplete',
  'Appealed',
  'In manual review',
  'Closed',
  'On hold',
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
    cy.clock(new Date(2024, 5, 25), ['Date']);
    cy.intercept('/data/cms/vamc-ehr.json', {});
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeClaims.happyPath();
    ApiInitializer.initializeClaimDetails.happyPath();
    cy.login(user);
    cy.visit(rootUrl);
    cy.injectAxeThenAxeCheck();
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  it('navigates to the platform 404 page if route not found', () => {
    cy.visit(`${rootUrl}/banana`);
    cy.findByTestId(pageNotFoundTestId).should('exist');
  });

  it('defaults to "most recent" sort order', () => {
    cy.get('select[name="claimsOrder"]').should('have.value', 'mostRecent');
  });

  it('shows a list of claims ordered by appointment date descending by default', () => {
    cy.get('h3[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'May 15, 2024');

    // Using fifth element to be less susceptible to
    // pagination changes and more confident in terms
    // of correct sort order
    cy.get('h3[data-testid="travel-claim-details"]')
      .eq(4)
      .should('include.text', ' June 22, 2023');
  });

  it('navigates to view claim details and back to status page', () => {
    cy.get('h3[data-testid="travel-claim-details"]~a')
      .first()
      .click();

    cy.location('pathname').should(
      'eq',
      '/my-health/travel-pay/claims/498d60a7-fe33-4ea8-80a6-80a27d9fc212',
    );

    cy.get('span[data-testid="claim-details-claim-number"]').should(
      'include.text',
      'Claim number: TC0000000000001',
    );

    cy.get('va-additional-info[trigger="What does this status mean?"]')
      .first()
      .click();

    cy.get('p[data-testid="status-definition-text"]').should(
      'contain.text',
      'We approved your claim',
    );

    // Wrapper to simulate Bradcrumbs spacing interferes with the cypress .get
    // cy.get('va-link[data-testid="details-back-link"]')
    //   .first()
    //   .click();

    // Instead just find the text for the link and click it
    cy.contains('Check your travel reimbursement claim status').click();

    cy.location('pathname').should('eq', '/my-health/travel-pay/claims/');
  });

  it('navigates to the status explainer page and back to status page', () => {
    cy.get('va-additional-info')
      .first()
      .click();

    cy.get('va-link[data-testid="status-explainer-link"]')
      .first()
      .click();

    cy.location('pathname').should('eq', '/my-health/travel-pay/help');

    cy.get('h1').should('include.text', 'What does my claim status mean?');

    // // get the 4th Breadcrumb, test that it is correct for the page
    cy.get('a')
      .eq(3)
      .should('include.text', 'Help: Claim Status Meanings');

    // The 3rd Breadcrumb link (since there are 2 with path: "/")
    cy.get('a')
      .eq(2)
      .click();
    cy.location('pathname').should('eq', '/my-health/travel-pay/claims/');
  });

  it('sorts the claims ordered by appointment date ascending on user action', () => {
    cy.get('select[name="claimsOrder"]').should('have.value', 'mostRecent');
    cy.get('select[name="claimsOrder"]').select('oldest');
    cy.get('select[name="claimsOrder"]').should('have.value', 'oldest');

    cy.get('va-button[data-testid="Sort travel claims"]').click();

    cy.get('h3[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'February 2, 2022');

    // Using fifth element to be less susceptible to
    // pagination changes and more confident in terms
    // of correct sort order
    cy.get('h3[data-testid="travel-claim-details"]')
      .eq(4)
      .should('include.text', 'August 11, 2022');
  });

  it('filters the claims by status and preserves default sort', () => {
    cy.openFilters();
    cy.selectVaCheckbox('Saved', true);
    cy.get('va-button[data-testid="apply_filters"]').click({
      waitForAnimations: true,
    });

    cy.get('va-card').should('have.length', 5);
  });

  it('filters the claims by multiple statuses and preserves default sort', () => {
    cy.openFilters();
    cy.selectVaCheckbox('Saved', true);
    cy.selectVaCheckbox('Incomplete', true);
    cy.get('va-button[data-testid="apply_filters"]').click({
      waitForAnimations: true,
    });

    cy.get('h3[data-testid="travel-claim-details"]').should('have.length', 6);
    cy.get('h3[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'May 15, 2024');
    cy.get('h3[data-testid="travel-claim-details"]')
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

    cy.get('h3[data-testid="travel-claim-details"]').should('have.length', 1);

    cy.get('h3[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'May 15, 2024');
  });

  it('filters by multiple properties with non-default sorting', () => {
    cy.get('select[name="claimsOrder"]').select('oldest');
    cy.get('select[name="claimsOrder"]').should('have.value', 'oldest');
    cy.get('va-button[data-testid="Sort travel claims"]').click();

    cy.openFilters();
    cy.selectVaCheckbox('Claim submitted', true);
    cy.get('select[name="claimsDates"]').select('All of 2023');
    cy.get('select[name="claimsDates"]').should('have.value', 'All of 2023');

    cy.get('va-button[data-testid="apply_filters"]').click({
      waitForAnimations: true,
    });

    cy.get('h3[data-testid="travel-claim-details"]').should('have.length', 3);
    cy.get('h3[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'May 17, 2023');
    cy.get('h3[data-testid="travel-claim-details"]')
      .eq(2)
      .should('include.text', 'December 28, 2023');
  });

  it('resets the filters when button is pressed', () => {
    cy.openFilters();
    cy.selectVaCheckbox('Saved', true);
    cy.get('va-button[data-testid="apply_filters"]').click({
      waitForAnimations: true,
    });
    cy.get('va-button[data-testid="reset_search"]').click({
      waitForAnimations: true,
    });
    cy.get('h3[data-testid="travel-claim-details"]').should('have.length', 10);
    testStatuses.forEach(statusName => {
      cy.get(`va-checkbox[name="${statusName}"`)
        .shadow()
        .find('input[type="checkbox"]')
        .should('not.be.checked');
    });
    cy.get('h3[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'May 15, 2024');
  });

  it('preserves sort order when filters are applied', () => {
    cy.get('select[name="claimsOrder"]').select('oldest');
    cy.get('va-button[data-testid="Sort travel claims"]').click();
    cy.openFilters();
    cy.selectVaCheckbox('Saved', true);
    cy.get('va-button[data-testid="apply_filters"]').click({
      waitForAnimations: true,
    });
    cy.get('h3[data-testid="travel-claim-details"]')
      .first()
      .should('include.text', 'March 27, 2022');
    cy.get('h3[data-testid="travel-claim-details"]')
      .eq(4)
      .should('include.text', 'August 16, 2023');
  });
});
