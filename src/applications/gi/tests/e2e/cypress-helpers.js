import calculatorConstantsJson from '../data/calculator-constants.json';
import autocomplete from '../data/autocomplete.json';
import institutionProfile from '../data/institution-profile.json';
import searchResults from '../data/search-results.json';
import { FORCE_OPTION } from 'platform/testing/e2e/cypress/support/form-tester';

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
  cy.route('GET', `/v0/gi/institutions/${facilityCode}`, profile);
};

// Create API routes
export const initApplicationMock = (
  profile = institutionProfile,
  results = searchResults,
) => {
  cy.route('GET', '/v0/gi/institutions/autocomplete', autocomplete);

  cy.route('GET', '/v0/gi/institutions/search', results);

  initMockProfile(profile);
};

export const expectLocation = urlSubstring => {
  cy.location().should(loc => {
    expect(loc.pathname).to.includes(urlSubstring);
  });
  cy.axeCheck();
};

export const clickButton = id => {
  cy.get(`#${id}`).click(FORCE_OPTION);
};
