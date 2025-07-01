/* eslint-disable no-console */
/* run-imposter-components-check.js
 * Script to run Cypress tests with imposter component checking for a specific application
 * Usage:
 * yarn cy:checkImposterComponents --path my-app-folder
 * yarn cy:checkImposterComponents --path "my-app-folder/subfolder"
 * yarn cy:checkImposterComponents --path "my-app-folder/tests/e2e/specific-test.cypress.spec.js"
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Parse command line arguments
const args = process.argv.slice(2);
const pathIndex = args.indexOf('--path');
const appPath = pathIndex !== -1 ? args[pathIndex + 1] : '';

if (!appPath) {
  console.error(
    chalk.red(
      'ERROR: No --path parameter provided. You MUST provide a path to the application folder or specific test file.',
    ),
  );
  console.log(
    chalk.yellow(
      'Usage:\nyarn cy:checkImposterComponents --path appeals/995\nyarn cy:checkImposterComponents --path ask-a-question\nyarn cy:checkImposterComponents --path "appeals/995/tests/e2e/specific-test.cypress.spec.js"',
    ),
  );
  process.exit(1);
}

// Determine if this is a specific file or a folder path
const isSpecificFile = appPath.endsWith('.cypress.spec.js');
const fullPath = path.join('src/applications', appPath);

// Check if the path exists
if (!fs.existsSync(fullPath)) {
  console.error(chalk.red(`ERROR: Path "${fullPath}" does not exist.`));
  process.exit(1);
}

// For specific files, also check if it's actually a file
if (isSpecificFile && !fs.statSync(fullPath).isFile()) {
  console.error(chalk.red(`ERROR: "${fullPath}" is not a file.`));
  process.exit(1);
}

const pathType = isSpecificFile ? 'test file' : 'application path';
console.log(
  chalk.yellow(`CHECKING FOR IMPOSTER COMPONENTS. ${pathType}: ${appPath}`),
);

// Clear any existing component usage report
const reportPath = 'cypress/component-usage-report.json';
if (fs.existsSync(reportPath)) {
  fs.unlinkSync(reportPath);
  console.log(chalk.green('Cleared existing component usage report.'));
}

// Run Cypress tests with imposter component checking enabled
try {
  // Build the spec pattern based on whether it's a specific file or folder
  const specPattern = isSpecificFile
    ? `src/applications/${appPath}`
    : `src/applications/${appPath}/**/*.cypress.spec.js`;

  const cypressCommand = `npx cypress run --config-file config/cypress.config.js --spec "${specPattern}" --env checkForImposterComponents=true`;

  console.log(
    chalk.blue('Running Cypress tests with imposter component checking...'),
  );
  console.log(chalk.gray(`Command: ${cypressCommand}`));

  execSync(cypressCommand, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  console.log(chalk.green('Cypress tests completed successfully.'));
} catch (error) {
  console.error(chalk.red('Error running Cypress tests:', error.message));
  process.exit(1);
}

// Check if report was generated and display results
if (fs.existsSync(reportPath)) {
  try {
    const reportContent = fs.readFileSync(reportPath, 'utf8');
    const report = JSON.parse(reportContent);

    if (report.issues && report.issues.length > 0) {
      console.log(
        chalk.yellow(`\n🔍 Found ${report.issues.length} imposter components:`),
      );
      console.log(chalk.yellow('='.repeat(60)));

      // Group issues by component type
      const groupedIssues = report.issues.reduce((acc, issue) => {
        const key = `${issue.tag}${issue.type ? `[${issue.type}]` : ''}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(issue);
        return acc;
      }, {});

      Object.entries(groupedIssues).forEach(([componentType, issues]) => {
        console.log(chalk.red(`\n${componentType} → ${issues[0].suggested}:`));
        issues.forEach(issue => {
          console.log(chalk.gray(`  Path: ${issue.path}`));
          if (issue.id) console.log(chalk.gray(`  ID: ${issue.id}`));
          if (issue.className)
            console.log(chalk.gray(`  Class: ${issue.className}`));
          if (issue.text) console.log(chalk.gray(`  Text: "${issue.text}"`));
          console.log('');
        });
      });

      console.log(chalk.yellow(`\nReport saved to: ${reportPath}`));
      console.log(
        chalk.blue(
          'Consider replacing these native HTML elements with VA web components.',
        ),
      );
    } else {
      console.log(
        chalk.green(
          '✅ No imposter components found! All components are using VA web components.',
        ),
      );
    }
  } catch (parseError) {
    console.error(
      chalk.red('Error reading component usage report:', parseError.message),
    );
  }
} else {
  console.log(
    chalk.yellow(
      'No component usage report generated. This may mean no tests were run or no imposter components were found.',
    ),
  );
}
