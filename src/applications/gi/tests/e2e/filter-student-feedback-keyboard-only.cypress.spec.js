import data from '../data/calculator-constants.json';
import institutionWithFeedbackMock from '../data/institution-21376032-mock-data.json';
/* eslint-disable cypress/unsafe-to-chain-command */

const expectFocusOnResults = () => {
  cy.get('#results-summary')
    .should('exist')
    .and('have.attr', 'tabindex', '-1');
};
describe('Filter Student Feedback — keyboard-only accessibility', () => {
  beforeEach(() => {
    Cypress.config('includeShadowDom', true);
    cy.intercept('GET', 'v1/gi/calculator_constants', {
      statusCode: 200,
      body: data,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'gi_comparison_tool_cautionary_info_update',
            value: true,
          },
          {
            name: 'gi_ct_collab',
            value: true,
          },
        ],
      },
    }).as('featureToggles');
    cy.window().then(win => {
      win.localStorage.setItem('institutionName', 'My Test Institution');
    });
    cy.intercept('GET', '**/v1/gi/institutions/21376032*', {
      statusCode: 200,
      body: institutionWithFeedbackMock,
    }).as('institutionWithFeedback');
    cy.visit(
      'education/gi-bill-comparison-tool/schools-and-employers/institution/21376032/filter-student-feedback',
    );
    cy.wait('@institutionWithFeedback');
    cy.wait('@featureToggles');
    cy.get('h1').should('be.focused');
  });

  it('Enter on "Apply filters" moves focus to results, then clear filters and move focus to results', () => {
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 1);
    cy.realPress('Enter');
    cy.repeatKey('Tab', 3);
    cy.realPress('Space');
    cy.repeatKey('Tab', 1);
    cy.realPress('Space');

    cy.repeatKey('Tab', 3);
    cy.realPress('Enter');
    cy.repeatKey('Tab', 3);
    cy.realPress('Space');
    cy.repeatKey('Tab', 5);
    cy.realPress('Enter');
    cy.contains(
      /Showing\s+1[\u2013-]5 of 5 results for “2022” “2023” “financial” with 3 filters applied/i,
    );
    expectFocusOnResults();
    cy.realPress(['Shift', 'Tab']);
    cy.realPress(['Shift', 'Tab']);
    cy.realPress('Enter');
    cy.contains(/Showing\s+1[\u2013-]8 of 20 results/i);
    expectFocusOnResults();
  });

  it('Keyboard change in Sort <va-select> moves focus to results', () => {
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 5);
    cy.realPress(['Alt', 'ArrowDown']);
    cy.realPress('ArrowDown');
    cy.realPress('Enter');
    expectFocusOnResults();
  });

  it('Keyboard activate page 2 via <va-pagination> then focus to results', () => {
    cy.injectAxeThenAxeCheck();
    cy.repeatKey('Tab', 7);
    cy.focused()
      .first()
      .invoke('attr', 'aria-label')
      .should('be.a', 'string')
      .and('not.be.empty');
    cy.realPress('Enter');
    cy.contains(/Showing\s+9[\u2013-]16 of 20 results/i);
    expectFocusOnResults();
  });
});
