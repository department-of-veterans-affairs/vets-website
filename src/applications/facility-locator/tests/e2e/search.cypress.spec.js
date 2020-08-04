import { facilityTypesOptions } from '../../config';
import { LocationType } from '../../constants';

describe('Facility search', () => {
  it('does a simple search and finds a result on the list', () => {
    cy.visit('https://staging.va.gov/find-locations/'); // can we make it real e2e?, with live data

    cy.injectAxe();
    cy.axeCheck();

    cy.get('#street-city-state-zip').type('Seattle, WA');

    cy.get('#facility-type-dropdown').select(
      facilityTypesOptions[LocationType.HEALTH],
    );
    cy.get('#facility-search').click();
    cy.get('#facility-search-results').should('exist');
    cy.get('.facility-result a').should('exist');
  });

  it('should render breadcrumbs ', () => {
    cy.visit('https://staging.va.gov/find-locations/');

    cy.injectAxe();
    cy.axeCheck();

    cy.get('#street-city-state-zip').type('Seattle, WA');
    cy.get('#facility-type-dropdown').select(
      facilityTypesOptions[LocationType.HEALTH],
    );
    cy.get('#facility-search').click();

    cy.get('.facility-result a').should('exist');

    cy.get('.facility-result a')
      .first()
      .click();

    cy.get('.all-details').should('exist');

    cy.get('a[aria-current="page"').should('exist');

    cy.get(
      '.va-nav-breadcrumbs-list li:nth-of-type(3) a[aria-current="page"]',
    ).should('exist');

    cy.get(
      '.va-nav-breadcrumbs-list li:nth-of-type(3) a[aria-current="page"]',
    ).contains('Facility Details');

    cy.get('.va-nav-breadcrumbs-list li:nth-of-type(2) a').click();
    cy.get('.facility-result a').should('exist');

    // Mobile View
    cy.viewport(375, 667);

    cy.get('.va-nav-breadcrumbs-list').should('exist');

    cy.get('.va-nav-breadcrumbs-list li:not(:nth-last-child(2))')
      .should('have.css', 'display')
      .and('match', /none/);

    cy.get('.va-nav-breadcrumbs-list li:nth-last-child(2)').contains('Home');
  });

  it('does not show search result header if no results are found', () => {
    cy.visit('https://staging.va.gov/find-locations?fail=true');
    cy.injectAxe();
    cy.axeCheck();

    cy.get('#facility-search-results').should('not.exist');
  });
});
