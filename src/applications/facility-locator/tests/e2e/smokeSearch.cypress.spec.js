import path from 'path';
import { facilityTypesOptions } from '../../config';
import { LocationType } from '../../constants';

describe('Facility smoke test', () => {
  before(() => {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  beforeEach(() => {
    cy.server();
    cy.route('GET', '/v0/feature_toggles?*', []);
    cy.route('GET', '/v0/maintenance_windows', []);
    cy.route('GET', '/v0/facilities/va?*', 'fx:constants/mock-facility-data');
    cy.route('GET', '/geocoding/**/*', 'fx:constants/mock-geocoding-data');
  });

  it('does a simple search and finds a result on the list', () => {
    cy.visit('/find-locations/');

    cy.injectAxe();
    cy.axeCheck();

    cy.get('#street-city-state-zip').type('Seattle, WA');

    cy.get('#facility-type-dropdown').select(
      facilityTypesOptions[LocationType.HEALTH],
    );
    cy.get('#facility-search').click();
    cy.get('#facility-search-results').should('exist');
    cy.get('.facility-result a').should('exist');
  });

  it('should render breadcrumbs ', () => {
    cy.visit(
      '/find-locations/?address=new%20york&context=New%20York%2C%20New%20York%2C%20United%20States&facilityType=health&location=40.7648%2C-73.9808',
    );
    cy.injectAxe();
    cy.axeCheck();

    cy.get('.facility-result a').should('exist');

    cy.get('.facility-result a')
      .first()
      .click();

    cy.get('.all-details').should('exist');

    cy.get('a[aria-current="page"').should('exist');

    cy.get(
      '.va-nav-breadcrumbs-list li:nth-of-type(3) a[aria-current="page"]',
    ).should('exist');

    cy.get(
      '.va-nav-breadcrumbs-list li:nth-of-type(3) a[aria-current="page"]',
    ).contains('Facility Details');

    cy.get('.va-nav-breadcrumbs-list li:nth-of-type(2) a').click();
    cy.get('.facility-result a').should('exist');

    // Mobile View
    cy.viewport(375, 667);

    cy.get('.va-nav-breadcrumbs-list').should('exist');

    cy.get('.va-nav-breadcrumbs-list li:not(:nth-last-child(2))')
      .should('have.css', 'display')
      .and('match', /none/);

    cy.get('.va-nav-breadcrumbs-list li:nth-last-child(2)').contains('Home');
  });
});
