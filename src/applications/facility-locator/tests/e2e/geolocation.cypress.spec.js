import path from 'path';

Cypress.Commands.add(
  'mockGeolocation',
  (latitude = 34.0522, longitude = -118.2437) => {
    cy.window().then($window => {
      cy.stub($window.navigator.geolocation, 'getCurrentPosition', callback => {
        return callback({ coords: { latitude, longitude } });
      });
    });
  },
);

// TODO - find a way to get this working

describe('Facility geolocation', () => {
  before(function() {
    cy.syncFixtures({
      constants: path.join(__dirname, '..', '..', 'constants'),
    });
  });

  it('geolocatees the user', () => {
    // Mock the call to Mapbox
    cy.route('GET', '/geocoding/**/*', 'fx:constants/mock-la-location').as(
      'caLocation',
    );

    cy.visit('/find-locations');

    cy.mockGeolocation();

    cy.get('#street-city-state-zip').should('be.empty');

    cy.get('.use-my-location-link')
      .click()
      .then(() => {
        cy.get('#street-city-state-zip').contains('Los Angeles', {
          timeout: 20000,
        });
      });
  });
});
