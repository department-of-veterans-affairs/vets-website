/**
 * Combines two common, sequentially called functions.
 *
 * Before running axe, waits for all VA Design System web components in the
 * check context to be hydrated (shadow DOM rendered). Stencil lazy-loads
 * component implementations via dynamic import(), so there is a window
 * after an element is in the DOM but before its shadow DOM is painted.
 * Running axe in that window can cause false heading-order violations
 * (e.g. an h2 inside a shadow root hasn't been rendered yet).
 */
Cypress.Commands.add('injectAxeThenAxeCheck', (context, tempOptions) => {
  cy.injectAxe();

  // Determine the CSS selector for the axe context (defaults to 'main').
  const selector =
    typeof context === 'string' ? context : context?.include || 'main';

  // Wait until every va-* custom element inside the check context has
  // Stencil's "hydrated" class, which is added after first render.
  // Using cy.get().should() ensures the DOM is re-queried on each retry,
  // avoiding stale element references from React re-renders.
  cy.get(selector, { timeout: 10000 }).should($ctx => {
    const pending = $ctx
      .find('*')
      .filter(
        (_, el) =>
          el.tagName.startsWith('VA-') && !el.classList.contains('hydrated'),
      );
    expect(
      pending.length,
      `${pending.length} va-* elements pending hydration`,
    ).to.equal(0);
  });

  // axeCheck() context parameter defaults to 'main'
  // axeCheck() tempOptions parameter defaults to {}
  if (tempOptions) {
    cy.axeCheck(context, tempOptions);
  } else if (context) {
    cy.axeCheck(context);
  } else {
    cy.axeCheck();
  }
});
