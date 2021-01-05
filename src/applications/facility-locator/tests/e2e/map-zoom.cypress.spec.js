Cypress.Commands.add('verifySearchArea', () => {
  const clickInterval = 10;

  // Zoom in
  [...Array(5)].forEach(_ =>
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy
      .get('.mapboxgl-ctrl-zoom-in')
      .click({ waitForAnimations: true })
      .wait(clickInterval),
  );

  // Verify search are button present
  cy.get('#search-area-control').should('exist');

  // Zoom out
  [...Array(13)].forEach(_ =>
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy
      .get('.mapboxgl-ctrl-zoom-out')
      .click({ waitForAnimations: true })
      .wait(clickInterval),
  );

  // Verify search are button not.be.visible
  cy.get('#search-area-control').should('not.be.visible');

  // Zoom in again
  [...Array(12)].forEach(_ =>
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy
      .get('.mapboxgl-ctrl-zoom-in')
      .click({ waitForAnimations: true })
      .wait(clickInterval),
  );

  // Verify search are button be.visible and click
  cy.get('#search-area-control').should('be.visible');
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

it('finds community care pharmacies', () => {
  cy.visit('/find-locations');

  cy.get('#street-city-state-zip').type('Austin, TX');
  cy.get('#facility-type-dropdown').select(
    'Community pharmacies (in VA’s network)',
  );
  cy.get('#facility-search')
    .click()
    .then(() => {
      cy.get('#search-results-subheader').contains(
        'Results for "Community pharmacies (in VA’s network)" near "Austin, Texas"',
      );
      cy.get('#other-tools').should('exist');

      cy.injectAxe();
      cy.axeCheck();

      cy.get('.facility-result h3').contains('CVS');
      cy.get('.va-pagination').should('not.exist');
      cy.verifySearchArea();
    });
});
