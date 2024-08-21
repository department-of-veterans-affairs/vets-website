import data from '../data/calculator-constants.json';

describe('go bill CT before search by location', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('education/gi-bill-comparison-tool/');
    cy.get('button[data-testid="Search-by-location"]').click();
  });
  it('should go to search by location when location Tab is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('label[id="institution-search-label"]').should(
      'contain',
      'City, state, or postal code',
    );
    cy.get('[id="mapbox-gl-container"]').should('exist');
  });
  it('should expand the dropdown for miles and select one', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('select[id="distance"]')
      .select('15')
      .should('have.value', '15');
    cy.get('option[value="15"]').should('contain', 'within 15 miles');
  });
  it('should show error if search input is empty and search button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="location-search-button"]').click();
    cy.get('[id="search-error-message"]').should(
      'contain',
      'Please fill in a city, state, or postal code.',
    );
  });
  it('should uncheck the checked boxes and check the unchecked boxes', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('va-checkbox[data-testid="school-type-Public"]').then($checkbox => {
      const isChecked = $checkbox.attr('checked') !== undefined;

      if (isChecked) {
        cy.wrap($checkbox).click();
        cy.wrap($checkbox).should('not.have.attr', 'checked', 'true');
      } else {
        cy.wrap($checkbox).click();
        cy.wrap($checkbox).should('have.attr', 'checked', 'true');
      }
    });
    cy.get('va-checkbox[data-testid="exclude-caution-flags"]').then(
      $checkbox => {
        const isChecked = $checkbox.attr('checked') !== undefined;

        if (isChecked) {
          cy.wrap($checkbox).click();
          cy.wrap($checkbox).should('not.have.attr', 'checked', 'true');
        } else {
          cy.wrap($checkbox).click();
          cy.wrap($checkbox).should('have.attr', 'checked', 'true');
        }
      },
    );
  });
  it('should reset filter back to orginal when Reset search button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('va-checkbox[data-testid="school-type-Public"]').click();
    cy.get('va-checkbox[data-testid="school-type-Public"]').should(
      'not.have.attr',
      'checked',
      'true',
    );
    cy.get('va-checkbox[data-testid="exclude-caution-flags"]').click();
    cy.get('va-checkbox[data-testid="exclude-caution-flags"]').should(
      'have.attr',
      'checked',
    );
    cy.get('[data-testid="clear-button"]').click();
    cy.get('va-checkbox[data-testid="school-type-Public"]').should(
      'have.attr',
      'checked',
    );
    cy.get('va-checkbox[data-testid="exclude-caution-flags"]').should(
      'not.have.attr',
      'checked',
      'true',
    );
  });
  it('should expand "Learn more about community focus filters" va-accordion when Go to community focus details link is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('a[data-testid="go-to-comm-focus-details"]').click();
    cy.get('[part="accordion-header"]').should(
      'have.attr',
      'aria-expanded',
      'true',
    );
  });
  it('should focuses on the input when the Apply filters button is clicked and show an error if input is empty', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('input[data-testid="ct-input"]').should('not.be.focused');
    cy.get('button[id="update-filter-your-results-button"]').click();
    cy.get('input[data-testid="ct-input"]').should('be.focused');
    cy.get('[id="search-error-message"]').should(
      'contain',
      'Please fill in a city, state, or postal code.',
    );
  });
});
