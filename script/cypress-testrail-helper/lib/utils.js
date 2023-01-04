/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const { exec } = require('child_process');
const { Spinner } = require('cli-spinner');
const { parse } = require('comment-parser');

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
    // Write run-specific Cypress config-file.
    return new Promise((myResolve, myReject) => {
      let cyTrConfig;
      let myCyTrRunConfig;

      try {
        // read cypress-testrail.config.js
        cyTrConfig = fs.readFileSync(
          './config/cypress-testrail.config.js',
          'utf-8',
        );
        // modify config prop-values
        myCyTrRunConfig = cyTrConfig
          .replace('TR_USER', myConfig.trUsername)
          .replace('TR_API_KEY', myConfig.trPassword)
          .replace('TR_PROJECTID', trInfo.projectId)
          .replace('TR_SUITEID', trInfo.suiteId)
          .replace('TR_GROUPID', trInfo.groupId)
          .replace('TR_RUN_NAME', trInfo.runName)
          .replace(/'TR_INCLUDE_ALL'/, 'false')
          .replace('TR_FILTER', '');
      } catch (e) {
        myReject(
          `Failed reading cypress-testrail.config.js file.  Error message: ${
            e.message
          }`,
        );
      }

      try {
        // write new config-file
        fs.writeFileSync(
          './config/my-cypress-testrail.config.js',
          myCyTrRunConfig,
          'utf-8',
        );
        console.log(
          chalk.green(
            'Your Run-specific Cypress config-file contents:\n\n+++++++++++++++++++++++++++++++\n',
            myCyTrRunConfig,
          ),
        );
        console.log(chalk.green('+++++++++++++++++++++++++++++++\n'));
        myResolve('succeeded');
      } catch (e) {
        myReject(
          `Failed writing my-cypress-testrail.config.js file.  Error message: ${
            e.message
          }`,
        );
      }
    });
  },
  runCySpec(specPath) {
    const spinner = new Spinner('%s processing...');
    let cp;

    spinner.setSpinnerString(18);
    spinner.start();

    cp = exec(`yarn cy:my-testrail-run --spec ${specPath}`);
    cp.stdout.on('data', data => {
      console.log(`Cypress child-process stdout:\n${data.toString()}`);
    });
    cp.stderr.on('data', data => {
      console.log(`Cypress child-process stderr:\n: ${data.toString()}`);
    });
    cp.on('exit', code => {
      spinner.stop(true);
      console.log('\n');
      if (code === 0) {
        console.log(
          chalk.green(
            `Cypress child-process SUCCEEDED! Exited with code ${code.toString()}`,
          ),
        );
      } else {
        chalk.red(
          `Cypress child-process FAILED! Exited with code ${code.toString()}`,
        );
      }
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
