import mockFacilityDataV1 from '../../constants/mock-facility-v1.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';

describe('Detail Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', []);
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/facilities_api/**', mockFacilityDataV1).as(
      'searchFacilities',
    );
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
  });

  it('renders static map images on detail page', () => {
    // from https://stackoverflow.com/questions/51246606/test-loading-of-image-in-cypress
    cy.visit('/find-locations/facility/vha_688GA');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[alt="Static map"]')
      .should('be.visible')
      .and($img => {
        // "naturalWidth" and "naturalHeight" are set when the image loads
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
  });
});
