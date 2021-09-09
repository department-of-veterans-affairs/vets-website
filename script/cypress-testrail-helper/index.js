/* eslint-disable no-console */
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs');

const inquirer = require('./lib/app-inquirer');

const cyConfig = require('../../config/cypress-testrail.json');

const appArgs = process.argv.slice(2);
const myConfigPath = './script/cypress-testrail-helper/my-config.json'; // Path for fs.

// Runtime variables.
let myConfig = undefined;
let projectSwitching = false;

// App functions.
const getSetCypressConfig = async () => {
  let projectAnswers = undefined;
  let answers = undefined;
  let newCyConfig = undefined;

  if (projectSwitching) {
    projectAnswers = await inquirer.askTestRailProjectOptions();
    myConfig = Object.assign(myConfig, projectAnswers);
    fs.writeFileSync(
      './script/cypress-testrail-helper/my-config.json',
      JSON.stringify({ ...myConfig, trIncludeAllInTestRun: false }),
    );
    // console.log('Updated myConfig:', myConfig);
    console.log(chalk.green('APP CONFIG-FILE UPDATED!'));
  }

  answers = await inquirer.askTestRailRunOptions();
  newCyConfig = Object.assign(cyConfig, {
    reporterOptions: {
      ...cyConfig.reporterOptions,
      username: myConfig.trUsername,
      password: myConfig.trPassword,
      projectId: parseInt(myConfig.trProjectId, 10),
      suiteId: parseInt(myConfig.trSuiteId, 10),
      includeAllInTestRun: false,
      groupId: parseInt(answers.groupId, 10),
      runName: answers.runName,
      filter: '',
    },
  });
  console.log('Your Run-specific Cypress config:', newCyConfig);

  // Write run-specific Cypress config-file.
  return new Promise((myResolve, myReject) => {
    try {
      fs.writeFileSync(
        './config/my-cypress-testrail.json',
        JSON.stringify(newCyConfig),
      );
      myResolve('succeeded');
    } catch (err) {
      myReject('failed');
    }
  });
};
const getSetAppConfig = async () => {
  const answers = await inquirer.askTestRailConfigOptions();

  myConfig = answers;

  return new Promise((myResolve, myReject) => {
    try {
      fs.writeFileSync(
        './script/cypress-testrail-helper/my-config.json',
        JSON.stringify({ ...answers, trIncludeAllInTestRun: false }),
      );
      myResolve('succeeded');
    } catch (err) {
      myReject('failed');
    }
  });
};

// RUNTIME CODE.

// Display banner.
clear();
console.log(
  chalk.green(
    figlet.textSync('Cypress-TestRail-Helper', {
      horizontalLayout: 'universal smushing',
      width: 80,
    }),
  ),
);

console.log('process.argv:', process.argv);
console.log('appArgs:', appArgs);

// Set projectSwitching.
if (
  (appArgs.includes('--switch-project') || appArgs.includes('--sp')) &&
  fs.existsSync(myConfigPath)
) {
  console.log('Project-switch option detected!');
  projectSwitching = true;
}

// IF no config-file exists, create one.
// IF config-file does exist, create run-specific Cypress config-file.
switch (fs.existsSync(myConfigPath)) {
  case true:
    // eslint-disable-next-line import/no-unresolved
    myConfig = require('./my-config.json');
    getSetCypressConfig().then(
      () => {
        console.log(
          chalk.green('RUN-SPECIFIC CYPRESS CONFIG-FILE CREATED!  Now run:'),
        );
        console.log(
          chalk.bgBlue(
            'yarn cy:my-testrail-run --spec <project-root-path-to-spec-file>',
          ),
        );
        console.log(chalk.green('THANK YOU & GOOD-BYE!'));
      },
      () => {
        console.error(
          chalk.red(
            'ERROR: Cypress config-file write failed!  Please try to create it manually. [See the app README.md file for instructions.]',
          ),
        );
      },
    );
    break;
  case false:
    console.log(chalk.yellow('App config-file missing -- creating one now...'));
    getSetAppConfig().then(
      () => {
        console.log(
          chalk.green(
            'APP CONFIG-FILE SUCCESSFULLY CREATED!  Now creating run-specific Cypress config-file...',
          ),
        );
        getSetCypressConfig().then(
          () => {
            console.log(
              chalk.green(
                'RUN-SPECIFIC CYPRESS CONFIG-FILE CREATED!  Now run:',
              ),
            );
            console.log(
              chalk.bgBlue(
                'yarn cy:my-testrail-run --spec <project-root-path-to-spec-file>',
              ),
            );
            console.log(chalk.green('THANK YOU & GOOD-BYE!'));
          },
          () => {
            console.error(
              chalk.red(
                'ERROR: Cypress config-file write failed!  Please try to create it manually. [See the app README.md file for instructions.]',
              ),
            );
          },
        );
      },
      () => {
        console.error(
          chalk.red(
            'ERROR: Config-file write failed!  Please try to create it manually. [See the app README.md file for instructions.]',
          ),
        );
      },
    );
    break;
  default:
    break;
}

/* eslint-disable no-console */
