import mockLaLocation from '../../constants/mock-la-location.json';
import {
  featureCombinationsTogglesToTest,
  isFeatureEnabled,
  enabledFeatures,
} from './featureTogglesToTest';

const featureSetsToTest = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
  'facilities_use_address_typeahead',
]);

Cypress.Commands.add(
  'mockGeolocation',
  (latitude = 34.0522, longitude = -118.2437) => {
    cy.window().then($window => {
      cy.stub($window.navigator.geolocation, 'getCurrentPosition', callback => {
        return setTimeout(() => {
          callback({ coords: { latitude, longitude } });
        }, 100);
      });
    });
  },
);

for (const featureSet of featureSetsToTest) {
  describe(`Facility geolocation ${enabledFeatures(featureSet)}`, () => {
    const isProgDiscEnabled = featureSet.some(
      isFeatureEnabled('facilities_use_fl_progressive_disclosure'),
    );

    const isAddressTypeaheadEnabled = featureSet.some(
      isFeatureEnabled('facilities_use_address_typeahead'),
    );

    const useMyLocationLink =
      isProgDiscEnabled && !isAddressTypeaheadEnabled
        ? '.use-my-location-link-desktop'
        : '.use-my-location-link';

    let locationInputField = isProgDiscEnabled
      ? '#location-input-field-desktop'
      : '#location-input-field';

    locationInputField = isAddressTypeaheadEnabled
      ? '.street-city-state-zip-autosuggest-label-container'
      : locationInputField;

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
      cy.get(locationInputField).contains('Finding your location...');
      cy.waitUntil(() =>
        cy
          .get(locationInputField)
          .contains('Use my location')
          .then(() => {
            // takes a bit of time for the input to update after setting the value
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(300);
            cy.get('#street-city-state-zip').then(elem => {
              const searchFieldValue = Cypress.$(elem).val();
              expect(searchFieldValue).to.include('Los Angeles');
            });
          }),
      );
    });
  });
}
