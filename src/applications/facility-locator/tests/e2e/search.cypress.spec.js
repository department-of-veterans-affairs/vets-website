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

  for (let i = 0; i < 60; i += 1) {
    it('does a simple search and finds a result on the list', () => {
      cy.visit('/find-locations');

      cy.injectAxe();
      cy.axeCheck();

      cy.verifyOptions();

      cy.get('#street-city-state-zip').type('Austin, TX', { delay: 200 });
      cy.get('#facility-type-dropdown').select('VA health');
      cy.get('#service-type-dropdown').select('Primary care');
      cy.get('#facility-search').click();
      cy.get('.current-pos-pin').click({
        waitForAnimations: true,
        timeout: 10000,
        force: true,
      });
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

      cy.get('#street-city-state-zip').type('Austin, TX', { delay: 200 });
      cy.get('#facility-type-dropdown').select('VA health');
      cy.get('#facility-search')
        .click()
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
            .click()
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

              cy.get('.va-nav-breadcrumbs-list li:nth-of-type(2) a').click();

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

    it('finds community dentists', () => {
      cy.visit('/find-locations');
      cy.injectAxe();

      cy.get('#street-city-state-zip').type('Austin, TX', { delay: 200 });
      cy.get('#facility-type-dropdown').select(
        'Community providers (in VA’s network)',
      );
      cy.get('#service-type-ahead-input').type('Dentist', { delay: 200 });
      cy.get('#downshift-1-item-0').click();

      cy.get('#facility-search').click();
      cy.get('.i-pin-card-map')
        .last()
        .click({
          waitForAnimations: true,
          timeout: 10000,
        });
      cy.get('#search-results-subheader').contains(
        'Results for "Community providers (in VA’s network)", "Dentist - Orofacial Pain " near "Austin, Texas"',
      );
      cy.get('#other-tools').should('exist');

      cy.axeCheck();

      cy.get('.facility-result h3').contains('BADEA, LUANA');

      cy.get('.va-pagination').should('not.exist');
    });

    it('finds community urgent care', () => {
      cy.visit('/find-locations');
      cy.injectAxe();

      cy.get('#street-city-state-zip').type('Austin, TX', { delay: 200 });
      cy.get('#facility-type-dropdown').select(
        'Community providers (in VA’s network)',
      );
      cy.get('#service-type-ahead-input').type('Clinic/Center - Urgent Care');
      cy.get('#downshift-1-item-0').click();

      cy.get('#facility-search').click();
      cy.get('.i-pin-card-map')
        .last()
        .click({
          waitForAnimations: true,
          timeout: 10000,
        });
      cy.get('#search-results-subheader').contains(
        'Results for "Community providers (in VA’s network)", "Clinic/Center - Urgent Care" near "Austin, Texas"',
      );
      cy.get('#other-tools').should('exist');

      cy.axeCheck();

      cy.get('.facility-result h3').contains('Concentra Urgent Care');
      cy.get('.va-pagination').should('not.exist');
    });

    it('finds community urgent care', () => {
      cy.visit('/find-locations');

      cy.get('#street-city-state-zip').type('Austin, TX', { delay: 200 });
      cy.get('#facility-type-dropdown').select('Urgent care');
      cy.get('#service-type-dropdown').select(
        'Community urgent care providers (in VA’s network)',
      );
      cy.get('#facility-search').click();
      cy.get('.i-pin-card-map')
        .last()
        .click({
          waitForAnimations: true,
          timeout: 10000,
        });
      cy.get('#search-results-subheader').contains(
        'Results for "Urgent care", "Community urgent care providers (in VA’s network)" near "Austin, Texas"',
      );
      cy.get('#other-tools').should('exist');

      cy.injectAxe();
      cy.axeCheck();

      cy.get('.facility-result h3').contains('MinuteClinic');
      cy.get('.va-pagination').should('not.exist');
    });

    it('should recover search from an error response state - invalid input location', () => {
      cy.visit('/find-locations');
      cy.injectAxe();

      // Invalid location search
      cy.route(
        'GET',
        '/geocoding/**/*',
        'fx:constants/mock-failed-location',
        'failedLocation',
      );

      cy.get('#street-city-state-zip').type('31234asd0o203o213', {
        delay: 150,
      });
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
      cy.get('#street-city-state-zip').clear();
      cy.get('#street-city-state-zip').type('Austin, TX', { delay: 200 });
      cy.get('#facility-type-dropdown').select('VA health');
      cy.get('#service-type-dropdown').select('Primary care');
      cy.get('#facility-search').click();
      cy.get('.i-pin-card-map')
        .last()
        .click({
          waitForAnimations: true,
          timeout: 10000,
        });
      cy.get('#search-results-subheader').contains(
        'Results for "VA health", "Primary care" near "Austin, Texas"',
      );
      cy.get('.facility-result a').should('exist');
      cy.axeCheck();
    });

    it('finds va benefits facility in Los Angeles and views its page', () => {
      cy.route('GET', '/geocoding/**/*', 'fx:constants/mock-la-location').as(
        'caLocation',
      );

      cy.visit('/find-locations');
      cy.injectAxe();

      cy.get('#street-city-state-zip').type('Los Angeles', { delay: 200 });
      cy.get('#facility-type-dropdown').select('VA benefits');
      cy.get('#facility-search').click();
      cy.get('.i-pin-card-map')
        .last()
        .click({
          waitForAnimations: true,
          timeout: 10000,
        });
      cy.get('#search-results-subheader').contains(
        'Results for "VA benefits", "All VA benefit services" near "Los Angeles, California"',
      );
      cy.get('#other-tools').should('exist');

      cy.axeCheck();

      cy.get('.facility-result a').contains(
        'Los Angeles Ambulatory Care Center',
      );
      cy.findByText(/Los Angeles Ambulatory Care Center/i, { selector: 'a' })
        .first()
        .click();
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

    it.skip('renders static map images on detail page', () => {
      // from https://stackoverflow.com/questions/51246606/test-loading-of-image-in-cypress
      cy.visit('/find-locations/facility/vha_688GA');
      cy.get('[alt="Static map"]')
        .should('be.visible')
        .and($img => {
          // "naturalWidth" and "naturalHeight" are set when the image loads
          expect($img[0].naturalWidth).to.be.greaterThan(0);
        });
    });
  }
});
