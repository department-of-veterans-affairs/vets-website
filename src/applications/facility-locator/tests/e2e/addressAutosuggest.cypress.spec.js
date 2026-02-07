import mapboxMockData from './autosuggest-data/mapbox.json';

describe('Facility Locator Address Autosuggest provides correct results from mapbox data', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/geocoding/**', mapboxMockData).as('mapbox');
    cy.intercept('GET', '/v0/maintenance_windows', []);
  });

  it('Search results in 5 results', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    cy.get('#street-city-state-zip').type('Port');
    cy.wait('@mapbox');
    // useCombobox hook generates IDs based on inputId prop
    cy.get('#street-city-state-zip-menu').should('exist');
    cy.get('#street-city-state-zip-menu')
      .children()
      .should('have.length', 5);
    cy.get('#street-city-state-zip-item-1').should('exist');
    cy.get('#street-city-state-zip').type('{downArrow}');
    cy.get('#street-city-state-zip').type('{downArrow}'); // mouseover doesn't seem to work in cypress to trigger css changes
    cy.get('#street-city-state-zip-item-1').should('have.class', 'selected');
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
