/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const { exec } = require('child_process');

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
  async getSetCypressConfig(myConfig, projectSwitching) {
    let projectAnswers = undefined;
    let answers = undefined;
    let newCyConfig = undefined;

    if (projectSwitching) {
      projectAnswers = await inquirer.askTestRailProjectOptions();
      // eslint-disable-next-line no-param-reassign
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
        myResolve(answers.specPath);
      } catch (err) {
        myReject('failed');
      }
    });
  },

  runCySpec(specPath) {
    const scriptCall = `yarn cy:my-testrail-run --spec ${specPath}`;

    exec(scriptCall, (error, stdout, stderr) => {
      if (error) {
        console.log(chalk.red(`error: ${error.message}`));
        return;
      }
      if (stderr) {
        console.log(chalk.red(`stderr: ${stderr}`));
        return;
      }
      console.log(chalk.green(`stdout: ${stdout}`));
    });
  },
};

/* eslint-enable no-console */
