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

const sharedElements = [
  'a[href]',
  'button',
  'details',
  'input[type="text"]',
  'input[type="email"]',
  'input[type="password"]',
  'input[type="search"]',
  'input[type="tel"]',
  'input[type="url"]',
  'input[type="checkbox"]',
  'input[type="number"]',
  'input[type="file"]',
  'input[type="date"]',
  'input[type="datetime-local"]',
  'input[type="month"]',
  'input[type="time"]',
  'input[type="week"]',
  'select',
  'textarea',
];

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
    // 'a[href]',
    // 'button',
    // 'details',
    // 'input[type="text"]',
    // 'input[type="email"]',
    // 'input[type="password"]',
    // 'input[type="search"]',
    // 'input[type="tel"]',
    // 'input[type="url"]',
    'input[type="radio"]',
    // 'input[type="checkbox"]',
    // 'input[type="number"]',
    // 'input[type="file"]',
    // 'input[type="date"]',
    // 'input[type="datetime-local"]',
    // 'input[type="month"]',
    // 'input[type="time"]',
    // 'input[type="week"]',
    // 'select',
    // 'textarea',
    '[tabindex="0"]',
    '[tabindex="-1"]',
  ];
  const elements = [...sharedElements, ...focusableElements];
  const msg = `Page does not contain ${count} focusable elements.`;
  elementsWithinCount(elements, selector, count, msg);
};

/**
 * Checks if the count of tabbable elements is correct. Tabbable elements are those
 * in the normal tab order (native focusable elements or those with tabIndex >= 0).
 */
export const hasTabbableCount = (selector, count) => {
  const tabbableElements = [
    // 'a[href]',
    // 'button',
    // 'details',
    // 'input[type="text"]',
    // 'input[type="email"]',
    // 'input[type="password"]',
    // 'input[type="search"]',
    // 'input[type="tel"]',
    // 'input[type="url"]',
    'input[type="radio"]:checked',
    // 'input[type="checkbox"]',
    // 'input[type="number"]',
    // 'input[type="file"]',
    // 'input[type="date"]',
    // 'input[type="datetime-local"]',
    // 'input[type="month"]',
    // 'input[type="time"]',
    // 'input[type="week"]',
    // 'select',
    // 'textarea',
    '[tabindex]:not([tabindex="-1"])',
  ];

  const elements = [...sharedElements, ...tabbableElements];
  const msg = `Page does not contain ${count} tabbable elements.`;
  elementsWithinCount(elements, selector, count, msg);
};
