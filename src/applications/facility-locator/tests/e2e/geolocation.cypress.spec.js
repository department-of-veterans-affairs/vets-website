import path from 'path';

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

describe('Facility geolocation', () => {
  before(function() {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  it('geolocates the user(', () => {
    // Mock the call to Mapbox
    cy.route('GET', '/geocoding/**/*', 'fx:constants/mock-la-location').as(
      'caLocation',
    );

    cy.visit('/find-locations');

    cy.mockGeolocation();

    cy.get('#street-city-state-zip').should('be.empty');

    cy.get('.use-my-location-link').click();
    cy.get('#location-input-field').contains('Finding your location...');
    cy.waitUntil(() =>
      cy
        .get('#location-input-field')
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
