import mockFacilitiesSearchResultsV1 from '../../constants/mock-facility-data-v1.json';

Cypress.Commands.add('verifySearchArea', () => {
  const clickInterval = 10;

  // Zoom in
  [...Array(15)].forEach(_ =>
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy
      .get('.mapboxgl-ctrl-zoom-in')
      .click({ waitForAnimations: true })
      .wait(clickInterval),
  );

  // Verify search are button present
  cy.get('#search-area-control').contains('Search this area of the map');

  // Zoom out
  [...Array(13)].forEach(_ =>
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy
      .get('.mapboxgl-ctrl-zoom-out')
      .click({ waitForAnimations: true })
      .wait(clickInterval),
  );

  // Verify search area button text changed
  cy.get('#search-area-control').contains('Zoom in to search');

  // Zoom in again
  [...Array(12)].forEach(_ =>
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy
      .get('.mapboxgl-ctrl-zoom-in')
      .click({ waitForAnimations: true })
      .wait(clickInterval),
  );

  // Verify search area button text changed back
  cy.get('#search-area-control').contains('Search this area of the map');
  cy.get('#search-area-control').click();

  // Move from area
  cy.get('.mapboxgl-canvas').swipe(
    [[310, 300], [310, 320], [310, 340], [310, 360], [310, 380]],
    [[50, 300], [50, 320], [50, 340], [50, 360], [50, 380]],
  );
  cy.get('#mapbox-gl-container').click({ waitForAnimations: true });

  // Verify search are button be.visible and click
  cy.get('#search-area-control').should('be.visible');
  cy.get('#search-area-control').click();
});

it('handles map zooming correctly', () => {
  cy.intercept('GET', '/v0/feature_toggles?*', { data: { features: [] } });
  cy.intercept('GET', '/v0/maintenance_windows', []);
  cy.intercept(
    'POST',
    '/facilities_api/v2/**',
    mockFacilitiesSearchResultsV1,
  ).as('searchFacilitiesVA');
  cy.visit('/find-locations');

  cy.get('#street-city-state-zip').type('Austin, TX');
  cy.get('#facility-type-dropdown')
    .shadow()
    .find('select')
    .select('VA health');
  cy.get('#facility-search')
    .click({ force: true })
    .then(() => {
      cy.get('#search-results-subheader').contains(
        /(Showing|Results).*VA health.*All VA health services.*near.*Austin, Texas/i,
      );
      cy.get('#other-tools').should('exist');

      cy.injectAxe();
      cy.axeCheck();

      cy.verifySearchArea();
    });
});
