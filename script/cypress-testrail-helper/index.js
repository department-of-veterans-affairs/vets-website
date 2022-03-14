/* eslint-disable no-console */
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs');

const utils = require('./lib/utils');
const myConfigPath = './script/cypress-testrail-helper/my-config.json'; // Project-root-relative path [for fs-call].
const appArgs = process.argv.slice(2);

// Runtime variables.
let isRerun = false;
let myConfig, specFile, trInfo;

// Check --rerun flag.
if (appArgs.includes('--rerun')) {
  isRerun = true;
}

// Cypress run-specific config and run function
const configRunCySpec = myConfig => {
  let prevSpec = null;

  if (isRerun) {
    if (myConfig.previousSpec) {
      prevSpec = myConfig.previousSpec;
      console.log(
        chalk.green(`--rerun flag detected!  Previous-run spec:\n${prevSpec}`),
      );
    } else {
      console.log(
        chalk.yellow(
          '--rerun flag detected, BUT no previous-run-spec info was found!\nPlease provide spec filename when prompted...',
        ),
      );
    }
  }

  console.log(chalk.yellow('CREATING CYPRESS RUN-SPECIFIC CONFIG-FILE NOW...'));
  utils
    .findSpecFiles(prevSpec)
    .then(async files => {
      filesLength = files.length;
      if (filesLength === 0) {
        console.log(chalk.yellow('NO SPEC-FILES FOUND!  Please try again.'));
        configRunCySpec(myConfig);
      } else if (filesLength === 1) {
        specFile = await files[0];
      } else {
        console.log(chalk.yellow('MULTIPLE SPEC-FILES FOUND!'));
        await utils
          .chooseSpecFile(files)
          .then(file => {
            specFile = file;
          })
          .catch(e => {
            console.log(chalk.red(`chooseSpecFile() failed! ${e}`));
          });
      }

      if (specFile) {
        utils
          .getSpecTrInfo(specFile)
          .then(parsedTrInfo => {
            trInfo = parsedTrInfo;
            utils
              .getSetCyRunConfig(myConfig, trInfo)
              .then(() => {
                console.log(
                  chalk.green(
                    'RUN-SPECIFIC CYPRESS CONFIG-FILE SUCCESSFULLY CREATED!',
                  ),
                );
                console.log(
                  chalk.yellow(
                    `${
                      isRerun ? 'RE-' : ''
                    }RUNNING CYPRESS SPEC [${specFile}] NOW...`,
                  ),
                );
                utils.runCySpec(specFile);
                utils.saveSpecFile(myConfig, myConfigPath, specFile);
              })
              .catch(e => {
                console.log(chalk.red(`chooseSpecFile() failed! ${e}`));
              });
          })
          .catch(e => {
            console.log(chalk.red(`getSpecTrInfo() failed! ${e}`));
          });
      }
    })
    .catch(e => {
      console.log(chalk.red(`configRunCySpec() failed! ${e}`));
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

// CHECK FOR CONFIG-FILE, GET/SET CONFIG(S), THEN RUN CYPRESS SPEC.
// IF no app config-file exists, create one.
// IF app config-file does exist, create run-specific Cypress config-file.
switch (fs.existsSync(myConfigPath)) {
  case true:
    // eslint-disable-next-line import/no-unresolved
    myConfig = require('./my-config.json');
    console.log(
      chalk.green(
        `APP CONFIG-FILE FOUND!  Current TestRail User: ${myConfig.trUsername}`,
      ),
    );

    configRunCySpec(myConfig);
    break;
  case false:
    console.log(chalk.yellow('APP CONFIG-FILE MISSING -- CREATING ONE NOW...'));
    utils
      .setMyConfig(myConfig)
      .then(() => {
        myConfig = require('./my-config.json');
        console.log(chalk.green('APP CONFIG-FILE SUCCESSFULLY CREATED!'));
        console.log(chalk.yellow(`RUNNING CYPRESS SPEC NOW: ${specFile}`));
        configRunCySpec(myConfig);
      })
      .catch(err => {
        console.error(chalk.red(`ERROR: ${err}`));
      });
    break;
  default:
    break;
}
/* eslint-disable no-console */
