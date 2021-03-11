import path from 'path';

describe('Detail Page', () => {
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

  it('renders static map images on detail page', () => {
    // from https://stackoverflow.com/questions/51246606/test-loading-of-image-in-cypress
    cy.visit('/find-locations/facility/vha_688GA');
    cy.get('[alt="Static map"]')
      .should('be.visible')
      .and($img => {
        // "naturalWidth" and "naturalHeight" are set when the image loads
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
  });
});
