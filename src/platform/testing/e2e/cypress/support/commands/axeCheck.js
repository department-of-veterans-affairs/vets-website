/**
 * Callback from a11y check that logs aXe violations to console output.
 *
 * https://github.com/avanslaars/cypress-axe/tree/61631c14a0190329cebc8f8ac9e8f81f1f1ce071#using-the-violationcallback-argument
 *
 * @param {Array} violations - Array of violations returned from the a11y check.
 */
const processAxeCheckResults = violations => {
  const violationMessage = `${violations.length} accessibility violation${
    violations.length === 1 ? ' was' : 's were'
  } detected`;

  // Pluck specific keys to keep the table readable.
  const violationData = violations.map(
    ({ id, impact, description, nodes, help, helpUrl }) => [
      ['id', id],
      ['impact', impact],
      ['description', description],
      ['help', help],
      ['help URL', helpUrl],
      ['target', nodes.map(node => node.target).join('\n\n')],
      ['html', nodes.map(node => node.html).join('\n\n')],
      ['failure summary', nodes.map(node => node.failureSummary).join('\n\n')],
      ['nodes', nodes.length],
    ],
  );

  cy.task('log', violationMessage);
  violationData.forEach(violation => cy.task('table', violation));
};

/**
 * Checks the passed selector and children for axe violations.
 * @param {string} [context=main] - CSS/HTML selector for the container element to check with aXe.
 * @param {Object} [tempOptions={}] - Rules object to enable _13647 exception or modify aXe config.
 */
Cypress.Commands.add('axeCheck', (context = 'main', tempOptions = {}) => {
  const { _13647Exception } = tempOptions;

  /**
   * Default required ruleset to meet Section 508 compliance.
   * Do not remove values[] entries. Only add new rulesets like 'best-practices'.
   *
   * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#axe-core-tags
   * for available rulesets.
   */
  //
  let axeBuilder = {
    runOnly: {
      type: 'tag',
      values: [
        'section508',
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'best-practice',
      ],
    },
    rules: {
      'color-contrast': {
        enabled: false,
      },
    },
  };

  /**
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
   */
  axeBuilder = Object.assign(axeBuilder, tempOptions);

  const axeConfig = _13647Exception
    ? { includedImpacts: ['critical'] }
    : axeBuilder;

  Cypress.log();
  cy.checkA11y(context, axeConfig, processAxeCheckResults);
});
