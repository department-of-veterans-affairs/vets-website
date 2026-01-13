import mockLaLocation from '../../constants/mock-la-location.json';
import {
  featureCombinationsTogglesToTest,
  enabledFeatures,
} from './featureTogglesToTest';

const featureSetsToTest = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
]);

Cypress.Commands.add(
  'mockGeolocation',
  (latitude = 34.0522, longitude = -118.2437) => {
    cy.window().then($window => {
      cy.stub($window.navigator.geolocation, 'getCurrentPosition', callback => {
        setTimeout(() => {
          callback({ coords: { latitude, longitude } });
        }, 100);
      });
    });
  },
);

for (const featureSet of featureSetsToTest) {
  describe(`Facility geolocation ${enabledFeatures(featureSet)}`, () => {
    const useMyLocationLink = '.use-my-location-link';

    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: featureSet,
        },
      });
    });

    it('geolocates the user', () => {
      // Mock the call to Mapbox
      cy.intercept('GET', '/geocoding/**/*', mockLaLocation).as('caLocation');

      cy.visit('/find-locations');

      cy.mockGeolocation();

      cy.get('#street-city-state-zip').should('be.empty');

      cy.get(useMyLocationLink).click();
      cy.get(useMyLocationLink).contains('Finding your location...');
      cy.waitUntil(() =>
        cy
          .get(useMyLocationLink)
          .contains('Use my location')
          .then(() => {
            cy.get('#street-city-state-zip').then(elem => {
              const searchFieldValue = Cypress.$(elem).val();
              expect(searchFieldValue).to.include('Los Angeles');
            });
          }),
      );
    });
  });
}
