const elementsWithinCount = (elements, selector, count, msg) => {
  cy.get(selector).within(() => {
    cy.get(elements.join(', '))
      .not('[disabled]')
      .should(list => {
        expect(list).have.length(count, msg);
      });
  });
};

const sharedElements = [
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

/**
 * Checks if the count of focusable elements is correct. Focusable elements are those
 * in the normal tab order (native focusable elements or those with tabIndex 0).
 * The count logic will break on tabindexes > 0 because we do not want to override the
 * browser's base tab order.
 *
 * This solution is inspired by two blog posts:
 * https://zellwk.com/blog/keyboard-focusable-elements/
 * https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
 */
export const hasFocusableCount = (selector, count) => {
  const focusableElements = [
    'input[type="radio"]',
    '[tabindex="0"]',
    '[tabindex="-1"]',
  ];
  const elements = [...sharedElements, ...focusableElements];
  const msg = `Page does not contain ${count} focusable elements.`;
  elementsWithinCount(elements, selector, count, msg);
};

/**
 * Checks if the count of tabbable elements is correct. Tabbable elements are those
 * in the normal tab order (native focusable elements or those with tabIndex >= 0).
 */
export const hasTabbableCount = (selector, count) => {
  const tabbableElements = [
    'input[type="radio"]:checked',
    '[tabindex]:not([tabindex="-1"])',
  ];

  const elements = [...sharedElements, ...tabbableElements];
  const msg = `Page does not contain ${count} tabbable elements.`;
  elementsWithinCount(elements, selector, count, msg);
};

Cypress.Commands.add('hasCount', (elementCategory, selector, count) => {
  if (elementCategory === 'focusable') hasFocusableCount(selector, count);
  if (elementCategory === 'tabbable') hasTabbableCount(selector, count);
});
