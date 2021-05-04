import path from 'path';

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
  cy.get('a.usa-button').contains('Register for care');
  cy.get('a.usa-button').contains('Pharmacy');
  if (isMobile) {
    cy.get('#sidenav-menu').should('be.visible');
  } else {
    cy.get('#sidenav-menu').should('not.be.visible');
  }
  cy.get('#sidebar-nav-trigger').should('not.exist');
  cy.get('h1').contains('Pittsburgh VA Medical Center-University Drive');
  cy.get('h2').contains('Location and contact information');
  cy.get('h2').contains('On this page');
  cy.get('h3').contains('Address');
  cy.get('h3').contains('Phone numbers');
  cy.get('.main-phone > a').contains(phoneRegex);
  cy.get('.mental-health-clinic-phone > a').contains(phoneRegex);
  cy.get('h3').contains('Clinical hours');
  cy.get('[data-widget-type="facility-map"]')
    .find('img.facility-img')
    .should('exist');
  cy.get('h2').contains('Prepare for your visit');
  cy.get('#health_care_local_facility_servi-4202').should('not.be.visible');
  cy.get('button')
    .contains('Parking')
    .click()
    .then(() => {
      cy.get('#health_care_local_facility_servi-4202').should('be.visible');
    });
  cy.get('button')
    .contains('Parking')
    .click()
    .then(() => {
      cy.get('#health_care_local_facility_servi-4202').should('not.be.visible');
    });
  cy.get('h3').contains('In the spotlight at VA Pittsburgh health care');

  cy.window().then(win => {
    if (win.contentData) {
      if (win.contentData.newsStoryTeasersFeatured?.entities.length > 0) {
        cy.get('#stories').contains('Stories');
        cy.get('a').contains('See all stories');
      } else {
        cy.get('#events').should('not.exist');
      }

      if (win.contentData.allEventTeasers?.entities.length > 0) {
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
  cy.get('#our-patient-satisfaction-scores').contains(
    'Veteran satisfaction with appointment wait times at this location',
  );
  cy.get('[data-widget-type="facility-patient-satisfaction-scores"]').should(
    'exist',
  );
  cy.get('h3').contains('Urgent care appointments');
  cy.get('h3').contains('Routine care appointments');
  cy.get('h2').contains('Get updates');
});

describe('VAMC location home page', () => {
  before(function() {
    if (Cypress.env('CIRCLECI')) this.skip();
    cy.syncFixtures({
      fixtures: path.join(__dirname, 'fixtures'),
    });
  });

  beforeEach(() => {
    cy.server();
    cy.route(
      'GET',
      '/v1/facilities/va/*',
      'fx:fixtures/mock-facility-data-v1',
    ).as('mockFacilityData');
  });

  it('has expected elements on desktop', () => {
    cy.checkElements(
      '/pittsburgh-health-care/locations/pittsburgh-va-medical-center-university-drive/',
      false,
    );
  });

  it('has expected elements on mobile', () => {
    cy.viewport(481, 1000);
    cy.checkElements(
      '/pittsburgh-health-care/locations/pittsburgh-va-medical-center-university-drive/',
      true,
    );
  });
});
