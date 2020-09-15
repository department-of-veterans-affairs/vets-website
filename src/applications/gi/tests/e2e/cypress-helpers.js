const calculatorConstantsJson = require('../data/calculator-constants.json');
const autocomplete = require('../data/autocomplete.json');
const institutionProfile = require('../data/institution-profile.json');
const searchResults = require('../data/search-results.json');

Cypress.on('uncaught:exception', (_err, _runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

// Default responses.
beforeEach(() => {
  cy.route('GET', '/v0/gi/calculator_constants', {
    data: calculatorConstantsJson,
  });
});

/**
 * Mocks the call for the profile
 * @param profile
 */
export const initMockProfile = profile => {
  const facilityCode = profile.data.attributes.facility_code;
  cy.route('GET', `/v0/gi/institutions/${facilityCode}`, {
    data: profile,
  });
};

// Create API routes
export const initApplicationMock = (
  profile = institutionProfile,
  results = searchResults,
) => {
  cy.route('GET', '/v0/gi/institutions/autocomplete', {
    data: autocomplete,
  });

  cy.route('GET', '/v0/gi/institutions/search', {
    data: results,
  });

  initMockProfile(profile);
};
