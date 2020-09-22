import {
  initApplicationMock,
  hasFocusableCount,
  hasTabbableCount,
} from './cypress-helpers';

/**
 * Go through CT via keyboard
 */
describe('Comparison Tool', () => {
  it('Go through CT via keyboard', () => {
    initApplicationMock();
    cy.visit('/gi-bill-comparison-tool').injectAxe();
    cy.axeCheck();

    // Assert the correct number of focusable elements in the form
    hasFocusableCount('#landing-page-form', 15);

    // Assert the correct number of tabbable elements in the form
    hasTabbableCount('#landing-page-form', 11);

    // Assert skip navigation link works correctly
    // Comment out for local testing
    // cy.get('body').tab();
    // cy.get('a.show-on-focus').should('have.focus');
    // cy.get('a.show-on-focus')
    //   .type('{enter}')
    //   .tab()
    //   .tab()
    //   .tab();

    cy.get('.va-nav-breadcrumbs-list > li > a')
      .first()
      .focus() // uncomment for local testing
      .should('have.focus')
      .should('have.attr', 'href', '/')
      .tab() // Move on to the form
      .tab()
      .tab();

    // Evaluate the military status select menu
    cy.get('#militaryStatus').should('have.focus');
    // cy.window().then(win => {
    //   cy.get('.keyword-search input[type="text"]').then(jQueryElement => {
    //     const elemHtml = jQueryElement.get(0);
    //
    //     elemHtml.addEventListener('keydown', event => {
    //       expect(event instanceof win.KeyboardEvent).to.be.true;
    //       done();
    //     });
    //   });
    // });
    cy.get('.keyword-search input[type="text"]').trigger('keydown', {
      eventConstructor: 'KeyboardEvent',
      keyCode: 65,
      which: 65,
      shiftKey: false,
      ctrlKey: false,
    });
    cy.get('.keyword-search input[type="text"]').should('have.value', 'a');

    // .type('{downarrow}')
    // .trigger('keydown', {
    //   eventConstructor: 'KeyboardEvent',
    //   keyCode: 32,
    //   which: 32,
    //   shiftKey: false,
    //   ctrlKey: false,
    // })
    // .should('have.value', 'active duty');
  });
});
