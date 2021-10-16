/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const { exec } = require('child_process');
const { Spinner } = require('cli-spinner');
const { parse } = require('comment-parser');

const cyConfig = require('../../../config/cypress-testrail.json');
const inquirer = require('./app-inquirer');
const { glob } = require('glob');

module.exports = {
  async setMyConfig() {
    const answers = await inquirer.askMyConfigOptions();

    return new Promise((myResolve, myReject) => {
      try {
        fs.writeFileSync(
          './script/cypress-testrail-helper/my-config.json',
          JSON.stringify({ ...answers }),
        );
        myResolve('setMyConfig succeeded');
      } catch (err) {
        myReject('setMyConfig failed');
      }
    });
  },
  async globSpecFiles() {
    let input, filename, specGlob;
    const answers = await inquirer.askSpecFilename();

    // clean input & set filename
    input = answers.specFilename;
    if (input.includes('/')) {
      // remove path in from of filename
      input = input.substr(input.lastIndexOf('/') + 1);
    }
    if (input.includes('.cypress.')) {
      // remove dot-extensions
      input = input.substring(0, input.indexOf('.cypress'));
    }
    filename = input;

    return new Promise((myResolve, myReject) => {
      try {
        specGlob = 'src/applications/**/' + filename + '.cypress.spec.js?(x)';
        console.log('specGlob: ', specGlob);
        glob(specGlob, {}, (err, files) => {
          if (err) {
            throw new Error(err);
          }
          myResolve(files);
        });
      } catch (err) {
        myReject(`globSpecFiles failed: ${err}`);
      }
    });
  },
  async chooseSpecFile(files) {
    const answers = await inquirer.askSpecFileChoice(files);

    console.log('answers.specFile: ', answers.specFile);

    return new Promise((myResolve, myReject) => {
      try {
        myResolve(answers.specFile);
      } catch (err) {
        myReject(`chooseSpecFile failed: ${err}`);
      }
    });
  },
  async getSpecTrInfo(specFile) {
    const parseComments = async data => {
      try {
        const parsedComments = await parse(data);
        return parsedComments;
      } catch (e) {
        console.error(chalk.red(`ERROR: ${e}`));
      }
    };

    return new Promise((myResolve, myReject) => {
      try {
        fs.readFile(specFile, 'utf8', async (err, data) => {
          const parsedTrInfo = {};
          let specComments, trCommentBlock, trCommentTags;

          if (err) throw new Error(err);

          specComments = await parseComments(data);
          trCommentBlock = specComments.filter(b =>
            b.description.toLowerCase().includes('testrail-integrated'),
          )[0];
          trCommentTags = trCommentBlock.tags.filter(
            t => t.tag.toLowerCase() === 'testrailinfo',
          );
          trCommentTags.forEach(t => {
            const tagName = t.name;
            const tagDescription = t.description;

            parsedTrInfo[tagName] =
              tagName === 'runName'
                ? tagDescription
                : parseInt(tagDescription, 10);
          });

          myResolve(parsedTrInfo);
        });
      } catch (err) {
        myReject(`readFile failed! ${err}`);
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
    let projectAnswers;
    let myNewConfig;

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

  parseSpecTrInfo(specPath) {
    // Parses TestRail-integrated spec's JSDOC comment-tags,
    // extracts TestRail-relevant comment-tags, and
    // returns TestRail info (projectId, suiteId, groupId, runName).
    const parseComments = async data => {
      try {
        const parsedComments = await parse(data);
        return parsedComments;
      } catch (e) {
        console.error(chalk.red(`ERROR: ${e}`));
      }
    };

    // delete any leading slash
    specPath = specPath.replace(/^\//, '');
    // prepend 'src/applications/**/' if missing
    if (!specPath.includes('src/applications/')) {
      if (specPath.indexOf('**/') === 0) {
        specPath = 'src/applications/' + specPath;
      } else {
        specPath = 'src/applications/**/' + specPath;
      }
      // console.log('specPath (prepended):', specPath);
    }
    // append file-extension pattern if missing
    if (!specPath.includes('.cypress.spec.js')) {
      specPath += '.cypress.spec.js?(x)';
    }
    console.log('specPath (modified):', specPath);

    // fs.readFile(specPath, 'utf8', async (err, data) => {
    //   const trInfo = {};
    //   let specComments, trCommentBlock, trCommentTags;

    //   if (err) throw err;

    //   specComments = await parseComments(data);
    //   // console.log('specComments:', specComments);

    //   trCommentBlock = specComments.filter(b =>
    //     b.description.toLowerCase().includes('testrail-integrated'),
    //   )[0];
    //   // console.log('trCommentBlock:', trCommentBlock);

    //   trCommentTags = trCommentBlock.tags.filter(
    //     t => t.tag.toLowerCase() === 'testrailinfo',
    //   );
    //   // console.log('trCommentTags:', trCommentTags);

    //   trCommentTags.forEach(t => {
    //     const tagName = t.name;
    //     const tagDescription = t.description;

    //     trInfo[tagName] =
    //       tagName === 'runName' ? tagDescription : parseInt(tagDescription, 10);
    //   });
    //   console.log('trInfo:', trInfo);
    // });

    console.log('\nreadFile called...');
  },
};

/* eslint-enable no-console */
