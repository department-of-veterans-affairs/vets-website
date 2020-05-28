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
 *
 * @param {boolean} assert - Flag for how tests handle aXe violations.
 *   If true, tests will stop and fail when there are violations.
 *   If false, tests will skip over violations and continue running.
 */
Cypress.Commands.add('axeCheck', (assert = true) => {
  Cypress.log({
    name: 'axeCheck',
    message: '',
    consoleProps: () => ({ 'Fail test on violations': assert }),
  });

  cy.checkA11y(
    '.main',
    {
      includedImpacts: ['critical'],
      runOnly: {
        type: 'tag',
        values: ['section508', 'wcag2a', 'wcag2aa', 'best-practice'],
      },
    },
    processAxeCheckResults,
    !assert,
  );
});
