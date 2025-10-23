/* eslint-disable no-console */

/**
 * This script will generate the code coverage for a single app
 * and open the coverage report in the browser.
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs-extra');
const open = require('open');
const path = require('path');
const chalk = require('chalk');

const appFolderArg = process.argv[2];
const appFolderValue = process.argv[3];

let appFolder;

if (appFolderArg === '--app-folder' && appFolderValue) {
  appFolder = appFolderValue;
} else if (appFolderArg && !appFolderArg.startsWith('--')) {
  appFolder = appFolderArg;
} else {
  console.error(
    'You must provide an app folder name either directly or using the --app-folder argument.',
  );
  console.log('Usage:');
  console.log('- yarn test:coverage-app simple-forms');
  console.log('- yarn test:coverage-app --app-folder simple-forms');
  process.exit(1);
}

if (!existsSync(path.join(__dirname, '..', 'src', 'applications', appFolder))) {
  console.log(
    `The app folder ${chalk.yellow(
      appFolder,
    )} does not exist in src/applications.`,
  );
  process.exit(1);
}

const cmd = `yarn test:unit --app-folder ${appFolder} --coverage --coverage-html --log-level debug`;

// Execute command
try {
  const output = execSync(cmd, { stdio: 'inherit' });
  if (output) {
    console.log(output);
  }
  open(path.join('coverage', 'index.html'));
} catch (error) {
  console.error(`Failed to run the test: ${error.message}`);
  process.exit(1);
}
