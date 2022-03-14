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
      } catch (e) {
        myReject(`fs.writeFileSync() failed! ${e}`);
      }
    });
  },
  async findSpecFiles(prevSpec) {
    let answers, input, filename, specGlob;

    if (!prevSpec) {
      // If no prevSpec provided, prompt for filename.
      answers = await inquirer.askSpecFilename();

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
    } else {
      // If prevSpec provided, set filename directly.
      filename = prevSpec.substring(
        prevSpec.lastIndexOf('/') + 1,
        prevSpec.indexOf('.cypress'),
      );
    }

    return new Promise((myResolve, myReject) => {
      try {
        specGlob = 'src/**/tests/**/' + filename + '.cypress.spec.js?(x)';
        glob(specGlob, {}, (err, files) => {
          if (err) {
            throw new Error(err);
          }
          myResolve(files);
        });
      } catch (e) {
        myReject(`globSpecFiles() failed: ${e}`);
      }
    });
  },
  async chooseSpecFile(files) {
    const answers = await inquirer.askSpecFileChoice(files);
    return new Promise((myResolve, myReject) => {
      try {
        myResolve(answers.specFile);
      } catch (e) {
        myReject(`chooseSpecFile() failed: ${e}`);
      }
    });
  },
  async getSpecTrInfo(specFile) {
    const parseComments = async data => {
      try {
        const parsedComments = await parse(data);
        return parsedComments;
      } catch (e) {
        console.log(chalk.red(`parsComments() failed! ${e}`));
      }
    };

    return new Promise((myResolve, myReject) => {
      try {
        fs.readFile(specFile, 'utf8', async (err, data) => {
          const parsedTrInfo = {};
          let specComments, trCommentBlocks, trCommentBlock, trCommentTags;

          specComments = await parseComments(data).catch(e => {
            console.log(chalk.red(`parseComments failed! ${e}`));
          });

          try {
            trCommentBlocks = specComments.filter(b =>
              b.description.toLowerCase().includes('testrail-integrated'),
            );
            trCommentBlock = trCommentBlocks[0];
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
          } catch (e) {
            if (
              e.message.includes("Cannot read property 'tags' of undefined")
            ) {
              console.log(
                chalk.red(`NO TESTRAIL COMMENTS FOUND IN SPEC-FILE! ${e}`),
              );
            } else {
              console.log(chalk.red(`PARSED-COMMENTS FILTERING FAILED! ${e}`));
            }
          }
        });
      } catch (e) {
        myReject(`fs.readFile() failed! ${e}`);
      }
    });
  },
  async getSetCyRunConfig(myConfig, trInfo) {
    const runConfig = Object.assign(cyConfig, {
      reporterOptions: {
        ...cyConfig.reporterOptions,
        username: myConfig.trUsername,
        password: myConfig.trPassword,
        projectId: parseInt(trInfo.projectId),
        suiteId: parseInt(trInfo.suiteId),
        includeAllInTestRun: false,
        groupId: parseInt(trInfo.groupId),
        runName: trInfo.runName,
        filter: '',
      },
    });

    // Write run-specific Cypress config-file.
    return new Promise((myResolve, myReject) => {
      try {
        fs.writeFileSync(
          './config/my-cypress-testrail.json',
          JSON.stringify(runConfig),
        );
        console.log(
          'Your Run-specific Cypress config:',
          Object.assign(runConfig, {
            reporterOptions: {
              ...runConfig.reporterOptions,
              password: '[---obfuscated---]',
            },
          }),
        );
        myResolve('succeeded');
      } catch (e) {
        myReject(`failed`);
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
      console.log(chalk.green(`RUN COMPLETED!  stdout:\n${stdout}`));
    });
  },
  saveSpecFile(myConfig, myConfigPath, specFile) {
    try {
      fs.writeFileSync(
        myConfigPath,
        JSON.stringify(Object.assign(myConfig, { previousSpec: specFile })),
      );
    } catch (e) {
      console.error('[saveSpecFile] fs.writeFileSync failed!');
    }
  },
};

/* eslint-enable no-console */
