import {
  initApplicationMock,
  hasFocusableCount,
  hasTabbableCount,
} from './cypress-helpers';

const tabLearnMore = ariaLabel => {
  cy.tab()
    .get(`button[aria-label="${ariaLabel}"]`)
    .first()
    .should('have.focus')
    .click()
    .axeCheck()
    .get('button[aria-label="Close this modal"]')
    .not('.va-crisis-panel-close')
    .should('have.focus')
    .click();
};

/**
 * Go through CT via keyboard
 *
 * keyboard navigation does not work with tab() or sometimes because cypress doesn't feel like it
 */
describe('Comparison Tool', () => {
  beforeEach(() => {
    initApplicationMock();
    cy.visit('/gi-bill-comparison-tool').injectAxe();
    cy.axeCheck();
  });

  it('tab through CT via keyboard', () => {
    // Assert the correct number of focusable elements in the form
    hasFocusableCount('#landing-page-form', 14);

    // Assert the correct number of tabbable elements in the form
    hasTabbableCount('#landing-page-form', 11);

    // This does NOT work in Cypress because apparently keyboard navigation isn't a thing to the framework
    // Assert skip navigation link works correctly
    // cy.get('body').tab();
    // cy.get('a.show-on-focus').should('have.focus');
    // cy.get('a.show-on-focus')
    //   .type('{enter}')
    //   .tab()
    //   .tab()
    //   .tab();

    // The focus in here is a hack to get to first element on page that a user would be tabbing
    // to after Pressing Enter on the "Skip to content" link that shows when tabbing through
    // the page in a browser
    cy.get('.va-nav-breadcrumbs-list > li > a')
      .first()
      .focus()
      .should('have.focus')
      .should('have.attr', 'href', '/');

    // Move on to the form
    cy.tab()
      .tab()
      .tab();

    // Tab to and change the military status select
    // keyboard navigation with space and arrows keys doesn't work
    cy.get('#militaryStatus')
      .should('have.focus')
      .select('active duty')
      .should('have.value', 'active duty');

    // Open and close the GI Bill Benefit modal
    tabLearnMore('Learn more about VA education and training programs');

    // Tab to and change the GI Bill Benefit select
    // keyboard navigation with space and arrows keys doesn't work
    cy.tab()
      .get('#giBillChapter')
      .should('have.focus')
      .select('30')
      .should('have.value', '30');

    // Open and close the enlistment modal
    tabLearnMore(
      'Learn more about how the length of Montgomery GI Bill active-duty service affects your benefits',
    );

    // Tab to and change the enlistment select
    // keyboard navigation with space and arrows keys doesn't work
    cy.tab()
      .get('#enlistmentService')
      .should('have.focus')
      .select('2')
      .should('have.value', '2');

    // Tab to the type of institution radio group and check first radio input is selected
    // keyboard navigation with arrow keys does not work
    cy.tab()
      .get(
        '.form-radio-buttons  input[name="category"][id^="radio-buttons-"][id$="-0"]',
      )
      .should('have.focus')
      .should('be.checked')
      .tab();

    // Skip the modal and tab to the checked type of class radio input.
    // This one is a bit unique because the second radio is pre-checked.
    // keyboard navigation with arrow keys does not work
    cy.tab()
      .tab()
      .tab()
      .get(
        '.form-radio-buttons  input[name="onlineClasses"][id^="radio-buttons-"][id$="-1"]',
      )
      .should('have.focus')
      .should('be.checked')
      .tab();

    // Let's try to submit an incomplete form by skipping over the city typeahead
    cy.tab()
      .tab()
      .get('#search-button')
      .should('be.enabled')
      .should('have.focus')
      .type('{enter}')
      .get('#search-error-message')
      .should('be.visible');
  });

  it('keyboard navigation of modals', () => {
    // Open and close the GI Bill Benefit modal
    cy.get(
      'button[aria-label="Learn more about VA education and training programs"]',
    )
      .first()
      .type(' ');
    cy.get('.va-modal-close')
      .not('.va-crisis-panel-close')
      .click(); // neither type('{enter}') or type(' ') are working

    cy.get('#giBillChapter')
      .select('30')
      .should('have.value', '30');

    // Open and close the enlistment modal
    cy.get(
      'button[aria-label="Learn more about how the length of Montgomery GI Bill active-duty service affects your benefits"]',
    )
      .first()
      .type(' ');
    cy.get('.va-modal-close')
      .not('.va-crisis-panel-close')
      .click(); // neither type('{enter}') or type(' ') are working
  });
});
