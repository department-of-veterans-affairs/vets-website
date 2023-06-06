describe('Facility Locator error handling', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', []);
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/facilities_api/**', {
      statusCode: 500,
      body: {
        error: 'server error',
      },
    }).as('getServerError');

    cy.visit('/find-locations');
  });

  it('should show an error if the API returns a non-200 response', () => {
    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('VA health');
    cy.get('#service-type-dropdown').select('Primary care');
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.wait('@getServerError');

    cy.get('h4.usa-alert-heading').contains(
      'Find VA locations isn’t working right now',
    );
    cy.get('#search-result-emergency-care-info').should('not.exist');
  });

  it('should show the 911 banner for emergency searches even if the API returns a non-200 response', () => {
    cy.intercept('GET', '/v0/feature_toggles?*', []);
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/facilities_api/**', {
      statusCode: 500,
      body: {
        error: 'server error',
      },
    }).as('getServerError');

    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('Emergency care');
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.wait('@getServerError');

    cy.get('h4.usa-alert-heading').contains(
      'Find VA locations isn’t working right now',
    );
    cy.get('#search-result-emergency-care-info')
      .contains('call')
      .contains('911');
  });
});
