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

it.skip('geolocatees the user', () => {
  cy.mockGeolocation();

  cy.visit('/find-locations');
  cy.injectAxe();

  cy.get('#street-city-state-zip').should('be.empty');

  cy.get('#facility-locate-user')
    .click()
    .then(() => {
      cy.get('#street-city-state-zip').contains('Los Angeles');
    });
});
