import * as h from './helpers';
import mapboxMockData from './autosuggest-data/mapbox.json';

describe('Facility Locator Address Autosuggest provides correct results from mapbox data', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/geocoding/**', mapboxMockData).as('mapbox');
    cy.intercept('GET', '/v0/maintenance_windows', []);
  });

  const verifyDropdownIsOpen = () => {
    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).should(
      'have.attr',
      'aria-expanded',
      'true',
    );
  };

  const verifyDropdownIsClosed = () => {
    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).should(
      'have.attr',
      'aria-expanded',
      'false',
    );
  };

  it('does not show dropdown results when fewer than 3 characters are typed', () => {
    cy.visit(h.ROOT_URL);
    cy.injectAxe();

    // Type 1 character — dropdown should NOT open
    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('P');
    verifyDropdownIsClosed();

    // Type a 2nd character (total: 2) — still below threshold
    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('o');
    verifyDropdownIsClosed();

    // Type a 3rd character (total: 3) — should now trigger
    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('r');
    verifyDropdownIsOpen();
  });

  it('sets aria-expanded correctly when dropdown opens and closes', () => {
    cy.visit(h.ROOT_URL);
    cy.injectAxe();

    // Initially closed
    verifyDropdownIsClosed();

    // Type enough to trigger dropdown
    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('Port');
    cy.wait('@mapbox');

    verifyDropdownIsOpen();

    // Press Escape to close
    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('{esc}');

    verifyDropdownIsClosed();
  });

  it('allows arrow key navigation and enter to select', () => {
    cy.visit(h.ROOT_URL);
    cy.injectAxe();

    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('Port');
    cy.wait('@mapbox');

    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type(
      '{downArrow}{downArrow}{downArrow}',
    );

    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('{enter}');
    verifyDropdownIsClosed();
  });

  it('clears the input and shows error state when clear button is clicked', () => {
    cy.visit(h.ROOT_URL);
    cy.injectAxe();

    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('Port');
    cy.wait('@mapbox');

    // Select a result first
    h.verifyElementExists(h.AUTOSUGGEST_ADDRESS_INPUT);
    h.clickElement(h.AUTOSUGGEST_ADDRESS_INPUT);

    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).should('not.have.value', '');

    // Now clear
    cy.get('#clear-street-city-state-zip').click();

    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).should('have.value', '');
    cy.get('#street-city-state-zip-autosuggest-container').should(
      'have.class',
      'usa-input-error',
    );
  });

  it('closes dropdown when backspacing below 3 characters', () => {
    cy.visit(h.ROOT_URL);
    cy.injectAxe();

    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('Port');
    cy.wait('@mapbox');

    // Dropdown should be open
    verifyDropdownIsOpen();

    // Backspace down to 2 characters ("Po")
    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('{backspace}{backspace}');

    // Dropdown should close since we're below 3 chars
    verifyDropdownIsClosed();
  });

  it('Search results in 5 results', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('Port');
    cy.wait('@mapbox');

    h.verifyElementExists(h.AUTOSUGGEST_ADDRESS_INPUT);
    h.clickElement(h.AUTOSUGGEST_ADDRESS_INPUT);
    verifyDropdownIsClosed();

    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).should(
      'have.value',
      'Port Hueneme, California, United States',
    );

    cy.axeCheck(); // check with menu open and value set

    cy.get('#clear-street-city-state-zip').click();
    cy.axeCheck(); // check with menu open and cleared

    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).should('have.value', '');
    cy.get('#street-city-state-zip-autosuggest-container').should(
      'have.class',
      'usa-input-error',
    );
    cy.axeCheck(); // check with menu open
  });
});
