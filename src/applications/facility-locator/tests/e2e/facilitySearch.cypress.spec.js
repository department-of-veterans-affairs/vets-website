import path from 'path';

Cypress.Commands.add('verifyOptions', () => {
  // Va facilities have services available
  cy.get('#facility-type-dropdown').select('VA health');
  cy.get('#service-type-dropdown').should('not.have.attr', 'disabled');
  cy.get('#facility-type-dropdown').select('Urgent care');
  cy.get('#service-type-dropdown').should('not.have.attr', 'disabled');
  cy.get('#facility-type-dropdown').select('VA benefits');
  cy.get('#service-type-dropdown').should('not.have.attr', 'disabled');

  // Va facilities don't have services available
  cy.get('#facility-type-dropdown').select('Vet Centers');
  cy.get('#service-type-dropdown').should('not.have', 'disabled');
  cy.get('#facility-type-dropdown').select('VA cemeteries');
  cy.get('#service-type-dropdown').should('not.have', 'disabled');

  // CCP care have services available
  cy.get('#facility-type-dropdown').select(
    'Community providers (in VA’s network)',
  );
  cy.get('#service-typeahead').should('not.have.attr', 'disabled');

  // CCP pharmacies dont have services available
  cy.get('#facility-type-dropdown').select(
    'Community pharmacies (in VA’s network)',
  );
  cy.get('#service-typeahead').should('not.have', 'disabled');
});

describe('Facility VA search', () => {
  before(function() {
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

    cy.verifyOptions();

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('VA health');
    cy.get('#service-type-dropdown').select('Primary care');
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      'Results for "VA health", "Primary care" near "Austin, Texas"',
    );
    cy.get('.facility-result a').should('exist');
    cy.get('.i-pin-card-map').contains('A');
    cy.get('.i-pin-card-map').contains('B');
    cy.get('.i-pin-card-map').contains('C');
    cy.get('.i-pin-card-map').contains('D');

    cy.get('.va-pagination').should('exist');
    cy.get('#other-tools').should('exist');
  });

  it.skip('should render breadcrumbs ', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('VA health');
    cy.get('#facility-search')
      .click({ waitForAnimations: true })
      .then(() => {
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
          .click({ waitForAnimations: true })
          .then(() => {
            cy.axeCheck();

            cy.get('.all-details', { timeout: 10000 }).should('exist');

            cy.get('a[aria-current="page"').should('exist');

            cy.get(
              '.va-nav-breadcrumbs-list li:nth-of-type(3) a[aria-current="page"]',
            ).should('exist');

            cy.get(
              '.va-nav-breadcrumbs-list li:nth-of-type(3) a[aria-current="page"]',
            ).contains('Facility Details');

            cy.get('.va-nav-breadcrumbs-list li:nth-of-type(2) a').click({
              waitForAnimations: true,
            });

            // Mobile View
            cy.viewport(375, 667);

            cy.get('.va-nav-breadcrumbs-list').should('exist');

            cy.get('.va-nav-breadcrumbs-list li:not(:nth-last-child(2))')
              .should('have.css', 'display')
              .and('match', /none/);

            cy.get('.va-nav-breadcrumbs-list li:nth-last-child(2)').contains(
              'Home',
            );
          });
      });
  });

  it('does not show search result header if no results are found', () => {
    cy.visit('/find-locations?fail=true');

    cy.get('#search-results-subheader').should('not.exist');
    cy.get('#other-tools').should('not.exist');
  });

  it('finds va benefits facility in Los Angeles and views its page', () => {
    cy.route('GET', '/geocoding/**/*', 'fx:constants/mock-la-location').as(
      'caLocation',
    );

    cy.visit('/find-locations');
    cy.injectAxe();

    cy.get('#street-city-state-zip').type('Los Angeles');
    cy.get('#facility-type-dropdown').select('VA benefits');
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      'Results for "VA benefits", "All VA benefit services" near "Los Angeles, California"',
    );
    cy.get('#other-tools').should('exist');

    cy.axeCheck();

    cy.get('.facility-result a').contains('Los Angeles Ambulatory Care Center');
    cy.findByText(/Los Angeles Ambulatory Care Center/i, { selector: 'a' })
      .first()
      .click({ waitForAnimations: true });
    cy.get('h1').contains('Los Angeles Ambulatory Care Center');
    cy.get('.p1')
      .first()
      .should('exist');
    cy.get('.facility-phone-group').should('exist');
    cy.findByText(/Get Directions/i).should('exist');
    cy.get('[alt="Static map"]').should('exist');
    cy.get('#hours-op h3').contains('Hours of operation');
    cy.get('#other-tools').should('not.exist');

    cy.axeCheck();
  });
});
