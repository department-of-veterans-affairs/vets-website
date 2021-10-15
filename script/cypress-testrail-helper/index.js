/* eslint-disable no-console */
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs');

const utils = require('./lib/utils');

const appArgs = process.argv.slice(2);
const myConfigPath = './script/cypress-testrail-helper/my-config.json'; // Project-root-relative path [for fs].

// Runtime variables.
let myConfig = undefined; // Config's generated & saved on first launch.
let projectSwitching = false; // Flag for changing config's saved Project & Suite IDs.

// Cypress run-specific config and run function
const configRunCySpec = appConfig => {
  console.log(chalk.yellow('CREATING CYPRESS RUN-SPECIFIC CONFIG-FILE NOW...'));
  utils
    .getSetCypressConfig(appConfig)
    .then(specPath => {
      console.log(chalk.green('CYPRESS RUN-SPECIFIC CONFIG-FILE CREATED!'));
      console.log(chalk.green(`NOW RUNNING CYPRESS SPEC: ${specPath}`));
      console.log(
        chalk.green(
          'CLI-prompt will return after Cypress child-process exits.\nTHANKS FOR USING CYPRESS-TESTRAIL-HELPER!',
        ),
      );

      // Run Cypress spec
      utils.runCySpec(specPath);
      utils.parseSpecTrInfo(specPath);
    })
    .catch(err => {
      console.error(chalk.red(`ERROR: ${err}`));
      process.exitCode = 1;
    });
};

// DISPLAY BANNER.
clear();
console.log(
  chalk.green(
    figlet.textSync('Cypress-TestRail-Helper', {
      horizontalLayout: 'universal smushing',
      width: 80,
    }),
  ),
);

// console.log('process.argv:', process.argv);
// console.log('appArgs:', appArgs);

// SET PROJECT-SWITCHING FLAG.
projectSwitching =
  (appArgs.includes('--switch-project') || appArgs.includes('--sp')) &&
  fs.existsSync(myConfigPath);

// CHECK FOR CONFIG-FILE, GET/SET CONFIG(S), THEN RUN CYPRESS SPEC.
// IF no config-file exists, create one.
// IF config-file does exist, create run-specific Cypress config-file.
switch (fs.existsSync(myConfigPath)) {
  case true:
    // eslint-disable-next-line import/no-unresolved
    myConfig = require('./my-config.json');
    console.log(
      chalk.yellow(
        `APP CONFIG-FILE FOUND!  Current ProjectID: ${
          myConfig.trProjectId
        }; Current Suite ID: ${myConfig.trSuiteId}`,
      ),
    );

    if (projectSwitching) {
      console.log(chalk.yellow('SWITCHING PROJECT...'));
      utils
        .getSetAppProjectConfig(myConfig)
        .then(() => {
          console.log(chalk.green('APP CONFIG-FILE UPDATED!'));
          configRunCySpec(myConfig);
        })
        .catch(err => {
          console.error(chalk.red(`'ERROR: ${err}`));
        });
    } else {
      configRunCySpec(myConfig);
    }
    break;
  case false:
    console.log(chalk.yellow('APP CONFIG-FILE MISSING -- CREATING ONE NOW...'));
    utils
      .getSetAppConfig(myConfig)
      .then(() => {
        console.log(
          chalk.green(
            'APP CONFIG-FILE SUCCESSFULLY CREATED!\nCREATING CYPRESS RUN-SPECIFIC CONFIG-FILE NOW...',
          ),
        );
        configRunCySpec(myConfig);
      })
      .catch(err => {
        console.error(
          chalk.red(
            `'ERROR: ${err}\n[See the app README.md file for instructions.]'`,
          ),
        );
      });
    break;
  default:
    break;
}
/* eslint-disable no-console */
