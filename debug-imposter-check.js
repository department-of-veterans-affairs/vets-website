/* eslint-disable no-console */
/* debug-imposter-check.js
 * Simple debug script to test if the imposter components checking is working
 */

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('Testing Cypress environment variable handling...'));

try {
  // Test if Cypress can read the environment variable
  const testCommand = `npx cypress run --config-file config/cypress.config.js --spec "src/platform/testing/e2e/cypress/support/form-tester/**/*.js" --headless --reporter json`;

  console.log(chalk.yellow('Running test command:'));
  console.log(chalk.gray(testCommand));

  const result = execSync(testCommand, {
    env: {
      ...process.env,
      // eslint-disable-next-line camelcase
      CYPRESS_checkForImposterComponents: 'true',
    },
    encoding: 'utf8',
  });

  console.log(chalk.green('Test completed. Output:'));
  console.log(result);
} catch (error) {
  console.log(chalk.red('Error running test:'));
  console.log(error.stdout || error.message);
}
