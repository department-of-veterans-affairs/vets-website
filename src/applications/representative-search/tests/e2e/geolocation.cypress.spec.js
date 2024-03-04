import mockLaLocation from '../../constants/mock-la-location.json';
import { generateFeatureToggles } from '../../mocks/feature-toggles';

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

describe('User geolocation', () => {
  it('geolocates the user(', () => {
    // Mock the call to Mapbox
    cy.intercept('GET', '/geocoding/**/*', mockLaLocation).as('caLocation');
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [{ name: 'find_a_representative_enabled', value: true }],
      },
    });
    cy.visit('/get-help-from-accredited-representative/find-rep/');
    generateFeatureToggles();
    cy.injectAxe();
    cy.axeCheck();
    cy.mockGeolocation();

    cy.get('#street-city-state-zip').should('be.empty');

    cy.get('.use-my-location-button').click();
    cy.get('.finding-your-location-loading').contains(
      'Finding your location...',
    );

    cy.waitUntil(() =>
      cy
        .get('.use-my-location-button')
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
