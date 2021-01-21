import { axeRulesObj } from '../axe-config/axe-rules';

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
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    }),
  );

  cy.task('log', violationMessage);
  cy.task('table', violationData);
};

/**
 * Checks the current page for aXe violations.
 * @param {string} [context] - Selector for the container element to aXe check.
 */
Cypress.Commands.add('axeCheck', (context = 'main', tempOptions = {}) => {
  /* Assume no exceptions and color contrast rule disabled as default */
  let options = {
    _13647Exception: false,
    colorContrast: axeRulesObj.colorContrast,
  };

  /* Update options with passed tempOptions */
  options = Object.assign(options, tempOptions);

  const axeConfig = options._13647Exception
    ? {
        includedImpacts: ['critical'],
      }
    : {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
        rules: {
          'color-contrast': {
            enabled: options.colorContrast,
          },
        },
      };

  Cypress.log();
  cy.checkA11y(context, axeConfig, processAxeCheckResults);
});
