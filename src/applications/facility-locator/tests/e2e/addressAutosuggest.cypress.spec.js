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
    cy.visit('/find-locations');
    cy.injectAxe();

    // Type 1 character — dropdown should NOT open
    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('Po');
    verifyDropdownIsClosed();

    // Type a 3rd character (total: 3) — should now trigger
    cy.get(h.AUTOSUGGEST_ADDRESS_INPUT).type('r');
    cy.wait('@mapbox');
    verifyDropdownIsOpen();
  });

  it('Search results in 5 results', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    cy.get('#street-city-state-zip').type('Port');

    cy.wait('@mapbox');

    cy.get(h.AUTOSUGGEST_ADDRESS_CONTAINER)
      .find(h.AUTOSUGGEST_ADDRESS_OPTIONS)
      .should('exist');
    cy.get(h.AUTOSUGGEST_ADDRESS_CONTAINER)
      .find(h.AUTOSUGGEST_ADDRESS_OPTIONS)
      .children()
      .should('have.length', 5);
    cy.get('#street-city-state-zip').type('{downArrow}');
    cy.get('#street-city-state-zip').type('{downArrow}'); // mouseover doesn't seem to work in cypress to trigger css changes
    cy.get(h.AUTOSUGGEST_ADDRESS_OPTIONS)
      .find('.dropdown-option')
      .eq(1)
      .should('have.class', 'selected');
    cy.get('#street-city-state-zip').type('{enter}');
    cy.axeCheck(); // check with menu open

    cy.get('#street-city-state-zip').should(
      'have.value',
      'Port Hueneme, California, United States',
    );
    cy.axeCheck(); // check with menu open and value set

    cy.get('#clear-street-city-state-zip').click();
    cy.axeCheck(); // check with menu open and cleared

    cy.get('#street-city-state-zip').should('have.value', '');
    cy.get('#street-city-state-zip-autosuggest-container').should(
      'have.class',
      'usa-input-error',
    );
    cy.axeCheck(); // check with menu open
  });
});
