import data from '../data/calculator-constants.json';

describe('CT before search by name accessibility', () => {
  beforeEach(() => {
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('education/gi-bill-comparison-tool/');
  });
  it('should traverses content via keyboard', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('va-breadcrumbs')
      .shadow()
      .find('nav li > a')
      .first()
      .focus();
    cy.focused().should('contain.text', 'VA.gov home');
    cy.repeatKey('Tab', 2);
    cy.focused().should(
      'contain.text',
      'GI Bill® Comparison Tool (Search By Name)',
    );
    cy.repeatKey('Tab', 4);
    cy.focused().should('contain.text', 'Search');
    cy.realPress('Enter');
    cy.get('input[data-testid="ct-input"]').should('be.focused');
    cy.get('[id="search-error-message"]').should(
      'contain',
      'Please fill in a school, employer, or training provider.',
    );
    cy.repeatKey('Tab', 2);
    cy.get('va-checkbox[data-testid="school-type-Public"]').should(
      'have.attr',
      'checked',
    );
    cy.realPress(['Shift', 'Tab']);
    cy.focused().should('contain.text', 'Search');
    cy.repeatKey('Tab', 13);
    cy.focused().should('contain.text', 'Go to community focus details');
    cy.realPress('Enter');
    cy.get('[part="accordion-header"]').should(
      'have.attr',
      'aria-expanded',
      'true',
    );
    cy.repeatKey('Tab', 11);
    cy.focused().should('contain.text', 'Apply filters');
    cy.realPress('Enter');
    cy.get('input[data-testid="ct-input"]').should('be.focused');
    cy.get('[id="search-error-message"]').should(
      'contain',
      'Please fill in a school, employer, or training provider.',
    );
    cy.repeatKey('Tab', 2);
    cy.get('[data-testid="school-type-Public"]').as('checkbox');
    cy.get('@checkbox').should('be.focused');
    cy.get('@checkbox').should('have.attr', 'checked');
    cy.get('@checkbox').click();
    cy.get('@checkbox').should('not.be.checked');
    cy.repeatKey('Tab', 7);
    cy.get('[data-testid="exclude-caution-flags"]').as('checkbox2');
    cy.get('@checkbox2').should('be.focused');
    cy.get('@checkbox2').should('not.be.checked');
    cy.get('@checkbox2').click();
    cy.get('@checkbox2').should('have.attr', 'checked');
    cy.repeatKey('Tab', 17);
    cy.focused()
      .should('contain.text', 'Reset search')
      .as('resetButton');
    cy.get('@resetButton').click();
    cy.get('@checkbox2').should('not.be.checked');
    cy.get('@checkbox').should('have.attr', 'checked');
    cy.repeatKey('Tab', 27);
    cy.focused().should(
      'contain.text',
      'Learn more about community focus filters',
    );
    cy.realPress('Enter');
    cy.get('[part="accordion-header"]').should(
      'not.have.attr',
      'aria-expanded',
      'true',
    );
    cy.repeatKey('Tab', 1);
    cy.focused().should('contain.text', 'About this tool');
    cy.realPress('Enter');
    cy.get('a[id="about-this-tool"]').then(link => {
      const href = link.prop('href');
      cy.visit(href);
    });
  });
});
