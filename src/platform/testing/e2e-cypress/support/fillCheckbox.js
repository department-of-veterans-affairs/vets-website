/**
 * Checks a checkbox if a condition is true
 *
 * @param {string} selector The css selector for the checkbox to fill
 * @param {function} condition Function that will be run to determine
 * whether or not to check the checkbox
 * @param {...any} params Parameters that will be passed to condition
 */
Cypress.Commands.add(
  'fillCheckbox',
  (selector, condition = true, ...params) => {
    let shouldClick = !!condition;
    if (typeof condition === 'function') {
      shouldClick = !!condition(...params);
    }

    if (shouldClick) {
      cy.get(selector).check();
    }
  },
);
