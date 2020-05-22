/**
 * Clicks the input specified if the condition evaluates to true.
 *
 * @param {string} selector The css selector for the element to click
 * @param {function} condition Function that will be run to determine
 * whether or not to click the element
 * @param {...any} params Parameters that will be passed to condition
 */
Cypress.Commands.add('clickIf', (selector, condition, ...params) => {
  let shouldClick = !!condition;
  if (typeof condition === 'function') {
    shouldClick = !!condition(...params);
  }

  if (shouldClick) {
    cy.get(selector).click();
  }
});
