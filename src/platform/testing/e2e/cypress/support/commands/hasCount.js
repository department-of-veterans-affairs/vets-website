const elementsWithinCount = (elements, selector, count, msg) => {
  cy.get(selector).within(() => {
    cy.get(elements.join(', '))
      .not('[disabled]')
      .should(list => {
        expect(list).have.length(count, msg);
      });
  });
};

const commonElements = [
  'a[href]',
  'button',
  'details',
  'input[type="text"]',
  'input[type="email"]',
  'input[type="password"]',
  'input[type="search"]',
  'input[type="tel"]',
  'input[type="url"]',
  'input[type="checkbox"]',
  'input[type="number"]',
  'input[type="file"]',
  'input[type="date"]',
  'input[type="datetime-local"]',
  'input[type="month"]',
  'input[type="time"]',
  'input[type="week"]',
  'select',
  'textarea',
];

const focusableElements = [
  'input[type="radio"]',
  '[tabindex="0"]',
  '[tabindex="-1"]',
];

const tabbableElements = [
  'input[type="radio"]:checked',
  '[tabindex]:not([tabindex="-1"])',
];

/**
 * Checks if the count of focusable or tabbable elements is correct.
 * Focusable elements are those in the normal tab order (native
 * focusable elements or those with tabIndex 0). The count logic
 * will break on tabindexes > 0 because we do not want to override
 * the browser's base tab order.
 * Tabbable elements are those in the normal tab order (native
 * focusable elements or those with tabIndex >= 0).
 */

Cypress.Commands.add('hasCount', (elementCategory, selector, count) => {
  let elements;
  let msg;

  if (elementCategory === 'focusable') {
    elements = [...commonElements, ...focusableElements];
    msg = `Page does not contain ${count} focusable elements.`;
  } else if (elementCategory === 'tabbable') {
    elements = [...commonElements, ...tabbableElements];
    msg = `Page does not contain ${count} tabbable elements.`;
  }

  elementsWithinCount(elements, selector, count, msg);
});
