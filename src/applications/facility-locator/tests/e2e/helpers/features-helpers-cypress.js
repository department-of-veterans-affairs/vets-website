// Cypress helper functions for mocking feature toggles
function initApplicationMock(featureSet = [], name = 'featureToggles') {
  cy.intercept('GET', '/v0/feature_toggles?*', {
    data: { features: featureSet },
  }).as(name);
}

module.exports = {
  initApplicationMock,
};
