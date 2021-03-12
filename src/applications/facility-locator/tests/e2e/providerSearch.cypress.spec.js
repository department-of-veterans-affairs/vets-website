import path from 'path';

describe('Provider search', () => {
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

  it('finds community dentists', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select(
      'Community providers (in VA’s network)',
    );
    cy.get('#service-type-ahead-input').type('Dentist');
    cy.get('#downshift-1-item-0').click({ waitForAnimations: true });

    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      'Results for "Community providers (in VA’s network)", "Dentist - Orofacial Pain " near "Austin, Texas"',
    );
    cy.get('#other-tools').should('exist');

    cy.axeCheck();

    cy.get('.facility-result h3').contains('BADEA, LUANA');

    cy.get('.va-pagination').should('not.exist');
  });

  it('finds community urgent care - Clinic/Center', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select(
      'Community providers (in VA’s network)',
    );
    cy.get('#service-type-ahead-input').type('Clinic/Center - Urgent Care');
    cy.get('#downshift-1-item-0').click({ waitForAnimations: true });

    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      'Results for "Community providers (in VA’s network)", "Clinic/Center - Urgent Care" near "Austin, Texas"',
    );
    cy.get('#other-tools').should('exist');

    cy.axeCheck();

    cy.get('.facility-result h3').contains('Concentra Urgent Care');
    cy.get('.va-pagination').should('not.exist');
  });

  it('finds community urgent care - Community urgent care providers (in VA’s network)', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('Urgent care');
    cy.get('#service-type-dropdown').select(
      'Community urgent care providers (in VA’s network)',
    );
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      'Results for "Urgent care", "Community urgent care providers (in VA’s network)" near "Austin, Texas"',
    );
    cy.get('#other-tools').should('exist');

    cy.injectAxe();
    cy.axeCheck();

    cy.get('.facility-result h3').contains('MinuteClinic');
    cy.get('.va-pagination').should('not.exist');
  });
});
