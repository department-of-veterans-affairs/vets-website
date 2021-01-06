Cypress.Commands.add('checkElements', () => {
  cy.get('#modal-announcement-title').should('exist');
  cy.get('button')
    .contains('Continue to the website')
    .click()
    .then(() => {
      cy.get('#modal-announcement-title').should('not.exist');
    });
  cy.get('.va-introtext').should('exist');
  cy.get('a.usa-button').contains('Make an appointment');
  cy.get('a.usa-button').contains('View all health services');
  cy.get('a.usa-button').contains('Register for care');
  cy.get('#sidebar-nav-trigger').should('not.exist');
  cy.get('#sidenav-menu').should('exist');
  cy.get('h1').contains('VA Pittsburgh health care');
  cy.get('h2').contains('Locations');
  cy.get('h3').contains('Manage your health online');
  cy.get('#in-the-spotlight-at-va-pittsbu').should('exist');
  cy.get('#stories').contains('Stories');

  // TODO: find a way to determine whether there are any upcoming
  // events, e.g. scrape https://www.va.gov/pittsburgh-health-care/events/
  // cy.get('#events').contains('Events');
});

describe('VAMC home page', () => {
  before(function() {
    if (Cypress.env('CIRCLECI')) this.skip();
  });

  it('has expected elements on desktop', () => {
    cy.visit('/pittsburgh-health-care/');
    cy.checkElements();
  });

  it('has expected elements on mobile', () => {
    cy.visit('/pittsburgh-health-care/');
    cy.viewport(481, 1000);
    cy.checkElements();
  });
});
