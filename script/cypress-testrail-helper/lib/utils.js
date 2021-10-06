/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const { exec } = require('child_process');
const { Spinner } = require('cli-spinner');

const cyConfig = require('../../../config/cypress-testrail.json');
const inquirer = require('./app-inquirer');

module.exports = {
  async getSetAppConfig(myConfig) {
    const answers = await inquirer.askTestRailConfigOptions();

    // eslint-disable-next-line no-unused-vars, no-param-reassign
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
  },
  async getSetCypressConfig(myConfig) {
    let answers = undefined;
    let newCyConfig = undefined;

    answers = await inquirer.askTestRailRunOptions();

    /* eslint-disable no-unused-vars, no-param-reassign, no-multi-assign */
    myConfig = newCyConfig = Object.assign(cyConfig, {
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
    /* eslint-enable no-unused-vars, no-param-reassign, no-multi-assign */

    // Write run-specific Cypress config-file.
    return new Promise((myResolve, myReject) => {
      try {
        fs.writeFileSync(
          './config/my-cypress-testrail.json',
          JSON.stringify(newCyConfig),
        );
        console.log(
          'Your Run-specific Cypress config:',
          Object.assign(newCyConfig, {
            reporterOptions: {
              ...newCyConfig.reporterOptions,
              password: '[---obfuscated---]',
            },
          }),
        );
        myResolve(answers.specPath);
      } catch (err) {
        myReject('failed');
      }
    });
  },

  runCySpec(specPath) {
    const scriptCall = `yarn cy:my-testrail-run --spec ${specPath}`;
    const spinner = new Spinner('%s processing...');

    spinner.setSpinnerString(18);
    spinner.start();
    exec(scriptCall, (error, stdout, stderr) => {
      if (error) {
        spinner.stop(true);
        console.log('\n');
        console.log(chalk.red(`error: ${error.message}`));
        return;
      }
      if (stderr) {
        spinner.stop(true);
        console.log('\n');
        console.log(chalk.red(`stderr: ${stderr}`));
        return;
      }
      spinner.stop(true);
      console.log('\n');
      console.log(chalk.green(`stdout: ${stdout}`));
    });
  },

  async getSetAppProjectConfig(myConfig) {
    let projectAnswers = undefined;
    let myNewConfig = undefined;

    projectAnswers = await inquirer.askTestRailProjectOptions();
    // eslint-disable-next-line no-unused-vars, no-param-reassign, no-multi-assign
    myConfig = myNewConfig = Object.assign(myConfig, projectAnswers);

    return new Promise((myResolve, myReject) => {
      try {
        fs.writeFileSync(
          './script/cypress-testrail-helper/my-config.json',
          JSON.stringify({ ...myNewConfig, trIncludeAllInTestRun: false }),
        );
        myResolve('succeeded');
      } catch (err) {
        myReject('failed');
      }
    });
  },
};

/* eslint-enable no-console */
