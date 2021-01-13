import path from 'path';

Cypress.Commands.add('checkSearch', () => {
  cy.axeCheck();

  // Search
  cy.get('#street-city-state-zip', { timeout: 10000 })
    .should('exist')
    .should('not.be.disabled')
    .clear({ force: true });

  cy.get('#street-city-state-zip')
    .should('not.be.disabled')
    .type('Austin, TX', { force: true });

  cy.get('#facility-type-dropdown').select('VA health');
  cy.get('#facility-search').click();

  // Search title
  cy.get('#search-results-subheader', { timeout: 10000 }).should('exist');

  // Tabs
  cy.get('#react-tabs-0').contains('View List');
  cy.get('#react-tabs-2').contains('View Map');

  // Result list
  cy.get('.facility-result').should('exist');

  // Switch tab map
  cy.get('#react-tabs-2')
    .should('not.be.disabled')
    .click({ waitForAnimations: true });

  // Ensure map is visible
  cy.get('#mapbox-gl-container').should('be.visible');

  // Pin
  cy.get('.i-pin-card-map')
    .should('be.visible')
    .contains('A');

  // Back to Result list
  cy.get('#react-tabs-0').click();
  cy.get('#street-city-state-zip').clear();
});

describe('Mobile', () => {
  before(() => {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  for(let i = 0; i < 60; i += 1) {
    it('should render in mobile layouts and tabs actions work', () => {
      cy.visit('/find-locations');
      cy.injectAxe();

      // iPhone X
      cy.viewport(400, 812);
      cy.checkSearch();

      // iPhone 6/7/8 plus
      cy.viewport(414, 736);
      cy.checkSearch();

      // Pixel 2
      cy.viewport(411, 731);
      cy.checkSearch();

      // Galaxy S5/Moto
      cy.viewport(360, 640);
      cy.checkSearch();
    });
  }

  it('should render the appropriate elements at each breakpoint', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    // desktop - large
    cy.viewport(1008, 1000);
    cy.axeCheck();
    cy.get('#facility-search').then($element => {
      expect($element.width()).closeTo(48, 2);
    });
    cy.get('.desktop-map-container').should('exist');
    cy.get('.react-tabs').should('not.exist');

    // desktop - small
    cy.viewport(1007, 1000);
    cy.axeCheck();
    cy.get('#facility-search').then($element => {
      expect($element.width()).closeTo(899, 2);
    });
    cy.get('.desktop-map-container').should('exist');
    cy.get('.react-tabs').should('not.exist');

    // tablet
    cy.viewport(768, 1000);
    cy.axeCheck();
    cy.get('#facility-search').then($element => {
      expect($element.width()).closeTo(660, 2);
    });
    cy.get('.desktop-map-container').should('exist');
    cy.get('.react-tabs').should('not.exist');

    // mobile
    cy.viewport(481, 1000);
    cy.axeCheck();
    cy.get('#facility-search').then($element => {
      expect($element.width()).closeTo(397, 2);
    });
    cy.get('.desktop-map-container').should('not.exist');
    cy.get('.react-tabs').should('exist');
  });
});