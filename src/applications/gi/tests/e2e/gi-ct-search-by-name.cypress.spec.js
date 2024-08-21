import data from '../data/calculator-constants.json';

describe('go bill CT before search by name', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('education/gi-bill-comparison-tool/');
  });
  it('show Comparison Tool title', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      'h1[class="vads-u-text-align--center small-screen:vads-u-text-align--left"',
    ).should('contain', 'GI Bill® Comparison Tool');
  });
  it('should show error if search input is empty and search button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="search-btn"]').click();
    cy.get('[id="search-error-message"]').should(
      'contain',
      'Please fill in a school, employer, or training provider.',
    );
  });
  it('should show Please select at least one filter. error message when all checkboxes are unchecked when search button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('va-checkbox[checked="true"]').each($checkbox => {
      cy.wrap($checkbox).click();
    });
    cy.get('[data-testid="ct-input"]').type('new york');
    cy.get('[data-testid="search-btn"]').click();
    cy.get('[id="search-error-message"]').should(
      'contain',
      'Please select at least one filter.',
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
      'Please fill in a school, employer, or training provider.',
    );
  });
  it('should visited https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp when About this tool link is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('a[id="about-this-tool"]').then(link => {
      const href = link.prop('href');
      cy.visit(href);
    });
  });
  it('should visited https://www.va.gov/ogc/apps/accreditation/index.asp when Search Accredited Attorneys, Claims Agents, or Veterans Service Organizations (VSO) Representatives link is click', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('a[id="disclaimer-link"]').then(link => {
      const href = link.prop('href');
      cy.visit(href);
    });
  });
});
