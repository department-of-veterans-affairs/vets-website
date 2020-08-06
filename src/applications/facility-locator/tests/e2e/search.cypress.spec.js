import testMockDataSearchResponse from '../fixtures/mock-data-v1.json';
import testMockDataFetch from '../../constants/mock-facility-v1.json';
import testGeoCodingDataAustin from '../../constants/mock-geocoding-data.json';

describe('Facility search', () => {
  beforeEach(() => {
    cy.server();
    cy.route('GET', '/geocoding/**/*', testGeoCodingDataAustin);
  });

  it('does a simple search and finds a result on the list', () => {
    cy.visit('/find-locations');

    cy.injectAxe();
    cy.axeCheck();

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('VA health');
    cy.route('GET', '/v1/facilities/va?*', testMockDataSearchResponse);
    cy.get('#facility-search').click();
    cy.get('#facility-search-results').should('exist');
    cy.get('.facility-result a').should('exist');
  });

  it('should render breadcrumbs ', () => {
    cy.visit('/find-locations');

    cy.injectAxe();
    cy.axeCheck();

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('VA health');
    cy.route('GET', '/v1/facilities/va?*', testMockDataSearchResponse);
    cy.get('#facility-search').click();
    cy.get('.facility-result a').should('exist');

    cy.route('GET', '/v1/facilities/va/vha_674BY', testMockDataFetch);
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
    cy.visit('/find-locations?fail=true');
    cy.injectAxe();
    cy.axeCheck();

    cy.get('#facility-search-results').should('not.exist');
  });
});
