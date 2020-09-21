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
    expect(loc.pathname).to.includes(urlSubstring.replace(/\s/g, '%20'));
  });
  cy.axeCheck();
};

export const expectParams = params => {
  const paramSubString = Object.values(params).map(
    (key, value) => `${key}=${value.replace(/\\s/g, '%20')}`,
  );
  cy.location().should(loc => {
    expect(loc.search).to.eq(`?${paramSubString}`);
  });
  cy.axeCheck();
};

export const clickButton = selector => {
  cy.get(`${selector}`)
    .first()
    .click(FORCE_OPTION);
};

export const selectDropdown = (name, option) => {
  const selector = `select[name="${name}"]`;
  cy.get(selector).select(option);
};

const elementsWithinCount = (elements, selector, count, msg) => {
  cy.get(selector).within(() => {
    cy.get(elements.join(', '))
      .not('[disabled]')
      .should(list => {
        expect(list).have.length(count, msg);
      });
  });
};

/**
 * Checks if the count of focusable elements is correct. Focusable elements are those
 * in the normal tab order (native focusable elements or those with tabIndex 0).
 * The count logic will break on tabindexes > 0 because we do not want to override the
 * browser's base tab order.
 *
 * This solution is inspired by two blog posts:
 * https://zellwk.com/blog/keyboard-focusable-elements/
 * https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
 */
export const hasFocusableCount = (selector, count) => {
  const focusableElements = [
    'a[href]',
    'button',
    'details',
    'input[type="text"]',
    'input[type="email"]',
    'input[type="password"]',
    'input[type="search"]',
    'input[type="tel"]',
    'input[type="url"]',
    'input[type="radio"]',
    'input[type="checkbox"]',
    'select',
    'textarea',
    '[tabindex="0"]',
    '[tabindex="-1"]',
  ];
  const msg = `Page does not contain ${count} focusable elements.`;
  elementsWithinCount(focusableElements, selector, count, msg);
};

/**
 * Checks if the count of tabbable elements is correct. Tabbable elements are those
 * in the normal tab order (native focusable elements or those with tabIndex >= 0).
 */
export const hasTabbableCount = (selector, count) => {
  const tabbableElements = [
    'a[href]',
    'button',
    'details',
    'input[type="text"]',
    'input[type="email"]',
    'input[type="password"]',
    'input[type="search"]',
    'input[type="tel"]',
    'input[type="url"]',
    'input[type="radio"]:checked',
    'input[type="checkbox"]',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
  ];

  const msg = `Page does not contain ${count} tabbable elements.`;
  elementsWithinCount(tabbableElements, selector, count, msg);
};
