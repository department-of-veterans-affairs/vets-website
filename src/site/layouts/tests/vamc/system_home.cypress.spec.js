const phoneRegex = /\d{3}-\d{3}-\d{4}/;

Cypress.Commands.add('checkElements', (page, isMobile) => {
  cy.visit(page);
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
  if (isMobile) {
    cy.get('#sidenav-menu').should('be.visible');
  } else {
    cy.get('#sidenav-menu').should('not.be.visible');
  }
  cy.get('h1').contains('VA Pittsburgh health care');
  cy.get('h2').contains('Locations');
  cy.get('[data-template="includes/facilityListing"]').each($listing => {
    cy.wrap($listing)
      .find('address')
      .should('exist');
    cy.wrap($listing)
      .contains('a', 'Directions')
      .should('exist');
    cy.wrap($listing)
      .find('.main-phone > a')
      .contains(phoneRegex);
    cy.wrap($listing)
      .find('.mental-health-clinic-phone > a')
      .contains(phoneRegex);
    cy.wrap($listing)
      .get('a > img.region-img')
      .should('exist');
  });
  cy.get('a').contains('See all locations');
  cy.get('h3').contains('Manage your health online');
  cy.get('h3').contains('In the spotlight at VA Pittsburgh health care');

  cy.window().then(win => {
    if (win.contentData) {
      if (win.contentData?.newsStoryTeasersFeatured?.entities?.length > 0) {
        cy.get('#stories').contains('Stories');
        cy.get('a').contains('See all stories');
      } else {
        cy.get('#stories').should('not.exist');
      }

      if (
        win.contentData?.eventTeasersFeatured?.entities?.length > 0 ||
        win.contentData?.eventTeasersAll?.entities?.length > 0
      ) {
        cy.get('#events').contains('Events');
      } else {
        cy.get('#events').should('not.exist');
      }
    } else {
      // window.contentData will be undefined in production
      // See src/site/includes/debug.drupal.liquid
      cy.task('log', 'window.contentData not found.');
    }
  });

  cy.get('h2').contains('Get updates');
});

describe('VAMC system home page', () => {
  before(function() {
    if (Cypress.env('CIRCLECI')) this.skip();
  });

  it('has expected elements on desktop', () => {
    cy.checkElements('/pittsburgh-health-care', false);
  });

  it('has expected elements on mobile', () => {
    cy.viewport(481, 1000);
    cy.checkElements('/pittsburgh-health-care', true);
  });
});
