/**
 * Playwright accessibility check helper.
 *
 * Uses @axe-core/playwright to run accessibility checks with the same
 * Section 508 ruleset used by the Cypress axeCheck command.
 */

const AxeBuilder = require('@axe-core/playwright').default;

/**
 * Default axe configuration matching the Cypress axeCheck command.
 * Runs Section 508 + WCAG 2.x AA checks with color-contrast disabled.
 */
const defaultAxeConfig = {
  runOnly: {
    type: 'tag',
    values: ['section508', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  },
  rules: {
    'color-contrast': { enabled: false },
    'empty-heading': { enabled: true },
    'heading-order': { enabled: true },
    'page-has-heading-one': { enabled: true },
  },
};

/**
 * Formats axe violations into a readable string for test failure output.
 *
 * @param {Array} violations - axe violation results
 * @returns {string} Formatted violation details
 */
function formatViolations(violations) {
  return violations
    .map(
      ({ id, impact, description, help, helpUrl, nodes }) =>
        `[${impact}] ${id}: ${description}\n` +
        `  Help: ${help}\n` +
        `  URL: ${helpUrl}\n` +
        `  Targets:\n${nodes
          .map(n => `    - ${n.target.join(', ')}\n      ${n.html}`)
          .join('\n')}`,
    )
    .join('\n\n');
}

/**
 * Runs an axe accessibility check on a Playwright page.
 *
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {string} [context='main'] - CSS selector to scope the check
 * @param {Object} [options={}] - Override options (_13647Exception, rule toggles)
 * @returns {Promise<Array>} Array of violations (empty = pass)
 */
async function axeCheck(page, context = 'main', options = {}) {
  const {
    _13647Exception,
    headingOrder = true,
    emptyHeading = true,
    pageHasHeadingOne = true,
  } = options;

  let builder = new AxeBuilder({ page }).include(context);

  if (_13647Exception) {
    builder = builder.options({ resultTypes: ['violations'] });
    // Only report critical impacts
    const results = await builder.analyze();
    return results.violations.filter(v => v.impact === 'critical');
  }

  builder = builder.withTags([
    'section508',
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
  ]);

  builder = builder.disableRules(['color-contrast']).options({
    rules: {
      'empty-heading': { enabled: emptyHeading },
      'heading-order': { enabled: headingOrder },
      'page-has-heading-one': { enabled: pageHasHeadingOne },
    },
  });

  const results = await builder.analyze();
  return results.violations;
}

module.exports = { axeCheck, formatViolations, defaultAxeConfig };
