import path from 'path';

describe('Facility search', () => {
  before(() => {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  beforeEach(() => {
    cy.server();
    cy.route('GET', '/v0/feature_toggles?*', []);
    cy.route('GET', '/v0/maintenance_windows', []);
    cy.route(
      'GET',
      '/v1/facilities/va?*',
      'fx:constants/mock-facility-data-v1',
    ).as('searchFacilities');
    cy.route('GET', '/geocoding/**/*', 'fx:constants/mock-geocoding-data');
  });

  it('does a simple search and finds a result on the list', () => {
    cy.visit('/find-locations');

    cy.injectAxe();
    cy.axeCheck();

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('VA health');
    cy.get('#service-type-dropdown').select('Primary care');
    cy.get('#facility-search').click();
    cy.get('#facility-search-results').contains(
      'Results for "VA health", "Primary care" near "Austin, Texas"',
    );
    cy.get('.facility-result a').should('exist');
  });

  it('should render breadcrumbs ', () => {
    cy.visit('/find-locations');

    cy.injectAxe();
    cy.axeCheck();

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('VA health');
    cy.get('#facility-search').click();
    cy.get('.facility-result a').should('exist');
    cy.route(
      'GET',
      '/v1/facilities/va/vha_674BY',
      'fx:constants/mock-facility-v1',
    ).as('fetchFacility');

    cy.findByText(/austin va clinic/i, { selector: 'a' })
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
