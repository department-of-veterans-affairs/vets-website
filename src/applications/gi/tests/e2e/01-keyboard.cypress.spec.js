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
  });
});
