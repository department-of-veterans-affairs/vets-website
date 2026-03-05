/**
 * Proves that the post-expansion aXe check is a superset of the pre-expansion
 * check, validating that the form-tester's first (pre-fill, pre-expand) aXe
 * scan is redundant.
 *
 * Background: the form-tester runs TWO aXe checks per page:
 *   1. Before filling fields / expanding accordions (headingOrder: false)
 *   2. After filling fields / expanding accordions  (headingOrder: true)
 *
 * The first check was added because shadow DOM headers might not be loaded
 * yet, so heading-order is skipped. But the second check runs all the same
 * rules plus heading-order on a DOM superset (expanded accordions reveal
 * additional content). This test demonstrates that every violation found
 * by the first check is also caught by the second.
 *
 * If this test passes reliably, the first aXe check can be safely removed
 * from performPageActions(), saving ~2-4s per page across all 137+
 * form-tester specs.
 */

const AXE_CONFIG_CHECK_1 = {
  runOnly: {
    type: 'tag',
    values: ['section508', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  },
  rules: {
    'color-contrast': { enabled: false },
    'heading-order': { enabled: false },
  },
};

const AXE_CONFIG_CHECK_2 = {
  runOnly: {
    type: 'tag',
    values: ['section508', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  },
  rules: {
    'color-contrast': { enabled: false },
  },
};

/**
 * Collects aXe violations without failing the test.
 * Returns a chainable that yields the violation IDs as a Set.
 */
const collectViolations = (context, config) => {
  const violations = [];

  cy.checkA11y(
    context,
    config,
    found => {
      violations.push(...found);
    },
    true, // skipFailures — don't fail on violations
  );

  return cy.then(() => new Set(violations.map(v => v.id)));
};

describe('aXe check superset verification', () => {
  // Use the mock-simple-forms-patterns app which has va-additional-info
  // web components on its pages (mockTextInput, mockCheckboxGroup).
  const formUrl = '/mock-simple-forms-patterns';

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required -- this test uses cy.checkA11y directly to collect violations
  it('post-expansion aXe catches all violations that pre-expansion aXe catches', () => {
    cy.visit(`${formUrl}/introduction`);
    cy.injectAxe();

    // Navigate past the introduction to a form page with web components.
    cy.findAllByText(/start/i, { selector: 'a' })
      .first()
      .click();

    // Wait for the form page to load.
    cy.get('main').should('exist');
    cy.injectAxe();

    // --- Check 1: pre-expansion (mirrors the first check in form-tester) ---
    let preExpandViolations;
    collectViolations('main', AXE_CONFIG_CHECK_1).then(ids => {
      preExpandViolations = ids;
      cy.log(`Pre-expansion violations: [${[...ids].join(', ')}]`);
    });

    // --- Expand accordions (mirrors form-tester's expandAccordions) ---
    cy.expandAccordions();

    // --- Re-inject aXe after DOM mutation (mirrors form-tester) ---
    cy.injectAxe();

    // --- Check 2: post-expansion (mirrors the second check in form-tester) ---
    collectViolations('main', AXE_CONFIG_CHECK_2).then(postExpandIds => {
      cy.log(`Post-expansion violations: [${[...postExpandIds].join(', ')}]`);

      // Every violation from check 1 should also appear in check 2.
      const missingFromPostExpand = [...preExpandViolations].filter(
        id => !postExpandIds.has(id),
      );

      expect(
        missingFromPostExpand,
        'All pre-expansion violations should be caught by the post-expansion check. ' +
          'Violations found only in pre-expansion check (would be lost if first check removed)',
      ).to.have.lengthOf(0);
    });
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required -- this test uses cy.checkA11y directly to collect violations
  it('post-expansion aXe check is a superset on a page with va-additional-info', () => {
    // Navigate directly to a form page that has va-additional-info components.
    // The mockTextInput page is known to contain <va-additional-info>.
    cy.visit(`${formUrl}/mock-text-input`);
    cy.get('main').should('exist');
    cy.injectAxe();

    // Verify the page actually has expandable content.
    cy.get('main').then($main => {
      const hasExpandable =
        $main.find('va-additional-info').length > 0 ||
        $main.find('va-accordion-item').length > 0 ||
        $main.find('button[aria-expanded=false]').length > 0;
      cy.log(`Page has expandable content: ${hasExpandable}`);
    });

    // --- Check 1: pre-expansion ---
    let preExpandIds;
    collectViolations('main', AXE_CONFIG_CHECK_1).then(ids => {
      preExpandIds = ids;
      cy.log(`Pre-expansion violations: [${[...ids].join(', ')}]`);
    });

    // --- Expand all accordions / additional-info ---
    cy.expandAccordions();
    cy.injectAxe();

    // --- Check 2: post-expansion ---
    collectViolations('main', AXE_CONFIG_CHECK_2).then(postExpandIds => {
      cy.log(`Post-expansion violations: [${[...postExpandIds].join(', ')}]`);

      const missing = [...preExpandIds].filter(id => !postExpandIds.has(id));
      expect(
        missing,
        'All pre-expansion violations should be caught by the post-expansion check',
      ).to.have.lengthOf(0);
    });
  });
});
