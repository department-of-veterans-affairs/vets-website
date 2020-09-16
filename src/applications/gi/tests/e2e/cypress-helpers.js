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

// Force interactions on elements, skipping the default checks for the
// "user interactive" state of an element, potentially saving some time.
// More importantly, this ensures the interaction will target the actual
// selected element, which overrides the default behavior that simulates
// how a real user might try to interact with a target element that has moved.
// https://github.com/cypress-io/cypress/issues/6165
export const FORCE_OPTION = { force: true };

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
