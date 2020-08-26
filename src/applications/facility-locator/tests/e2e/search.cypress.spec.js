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
    cy.get('.i-pin-card-map').contains('A');
    cy.get('.i-pin-card-map').contains('B');
    cy.get('.i-pin-card-map').contains('C');
    cy.get('.i-pin-card-map').contains('D');
  });

  it('should render breadcrumbs ', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('VA health');
    cy.get('#facility-search').click();

    cy.injectAxe();
    cy.axeCheck();

    cy.get('.facility-result a').should('exist');
    cy.route(
      'GET',
      '/v1/facilities/va/vha_674BY',
      'fx:constants/mock-facility-v1',
    ).as('fetchFacility');

    cy.findByText(/austin va clinic/i, { selector: 'a' })
      .first()
      .click();

    cy.axeCheck();

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

    cy.get('#facility-search-results').should('not.exist');
  });

  it('finds community dentists', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select(
      'Community providers (in VA’s network)',
    );
    cy.get('#service-type-ahead-input').type('Dentist');
    cy.get('#downshift-1-item-0').click();

    cy.get('#facility-search').click();
    cy.get('#facility-search-results').contains(
      'Results for "Community providers (in VA’s network)", "Dentist - Orofacial Pain " near "Austin, Texas"',
    );

    cy.injectAxe();
    cy.axeCheck();

    cy.get('.facility-result h3').contains('BADEA, LUANA');
  });

  it('finds community urgent care', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select(
      'Community providers (in VA’s network)',
    );
    cy.get('#service-type-ahead-input').type('Clinic/Center - Urgent care');
    cy.get('#downshift-1-item-0').click();

    cy.get('#facility-search').click();
    cy.get('#facility-search-results').contains(
      'Results for "Community providers (in VA’s network)", "Clinic/Center - Urgent Care" near "Austin, Texas"',
    );

    cy.injectAxe();
    cy.axeCheck();

    cy.get('.facility-result h3').contains('Concentra Urgent Care');
  });

  it('finds community urgent care', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('Urgent care');
    cy.get('#service-type-dropdown').select(
      'Community urgent care providers (in VA’s network)',
    );
    cy.get('#facility-search').click();
    cy.get('#facility-search-results').contains(
      'Results for "Urgent care", "Community urgent care providers (in VA’s network)" near "Austin, Texas"',
    );

    cy.injectAxe();
    cy.axeCheck();

    cy.get('.facility-result h3').contains('MinuteClinic');
  });

  it('finds va urgent care pharmacies', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select(
      'Community pharmacies (in VA’s network)',
    );
    cy.get('#facility-search').click();
    cy.get('#facility-search-results').contains(
      'Results for "Community pharmacies (in VA’s network)" near "Austin, Texas"',
    );

    cy.injectAxe();
    cy.axeCheck();

    cy.get('.facility-result h3').contains('CVS');
  });

  it('should recover search from an error response state - invalid input location', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    // Invalid location search
    cy.route('GET', '/geocoding/**/*', 'fx:constants/mock-failed-location').as(
      'failedLocation',
    );

    cy.get('#street-city-state-zip').type('31234asd0o203o213');
    cy.get('#facility-type-dropdown').select('VA health');
    cy.get('#facility-search').click();
    cy.get('.facility-search-results').contains(
      /Something’s not quite right. Please enter a valid or different location and try your search again./gi,
    );
    cy.axeCheck();

    // Valid location search
    cy.route('GET', '/geocoding/**/*', 'fx:constants/mock-geocoding-data').as(
      'validLocationSearch',
    );
    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('VA health');
    cy.get('#service-type-dropdown').select('Primary care');
    cy.get('#facility-search').click();
    cy.get('#facility-search-results').contains(
      'Results for "VA health", "Primary care" near "Austin, Texas"',
    );
    cy.get('.facility-result a').should('exist');
    cy.axeCheck();
  });
});
