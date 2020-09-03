import path from 'path';

Cypress.Commands.add('checks', () => {
  cy.injectAxe();
  cy.axeCheck();

  // Search
  cy.get('#street-city-state-zip').type('Austin, TX');
  cy.get('#facility-type-dropdown').select('VA health');
  cy.get('#facility-search').click();

  // Search title
  cy.get('#search-results-subheader').should('exist');

  // Tabs
  cy.get('#react-tabs-0').contains('View List');
  cy.get('#react-tabs-2').contains('View Map');

  // Result list
  cy.get('.facility-result').should('exist');

  // Switch tab map
  cy.get('#react-tabs-2').click();

  // Pin
  cy.get('.i-pin-card-map').contains('A');

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

  it('should render in mobile layouts and tabs actions work', () => {
    cy.visit('/find-locations');

    // iPhone X
    cy.viewport(400, 812);
    cy.checks();

    // iPhone 6/7/8 plus
    cy.viewport(414, 736);
    cy.checks();

    // Pixel 2
    cy.viewport(411, 731);
    cy.checks();

    // Galaxy S5/Moto
    cy.viewport(360, 640);
    cy.checks();
  });
});
