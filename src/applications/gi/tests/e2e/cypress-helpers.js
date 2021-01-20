import calculatorConstantsJson from '../data/calculator-constants.json';
import autocomplete from '../data/autocomplete.json';
import institutionProfile from '../data/institution-profile.json';
import searchResults from '../data/search-results.json';

Cypress.on('uncaught:exception', (_err, _runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

// Default responses.
beforeEach(() => {
  cy.route('GET', '/v0/gi/calculator_constants', calculatorConstantsJson);
});

/**
 * Mocks the call for the profile
 * @param profile
 */
export const initMockProfile = profile => {
  const facilityCode = profile.data.attributes.facility_code;
  cy.route('GET', `/v0/gi/institutions/${facilityCode}`, profile).as(
    `profile${facilityCode}`,
  );
};

/**
 * Setups up search results and a profile
 * Calling this will also load calculator_constants
 * Feature flags are loaded in src/platform/testing/e2e/cypress/support/index.js
 * @param profile
 * @param results
 */
export const initApplicationMock = (
  profile = institutionProfile,
  results = searchResults,
) => {
  cy.route('GET', '/v0/gi/institutions/autocomplete**', autocomplete).as(
    'defaultAutocomplete',
  );
  cy.route('GET', '/v0/gi/institutions/search**', results).as('defaultSearch');

  initMockProfile(profile);
};
