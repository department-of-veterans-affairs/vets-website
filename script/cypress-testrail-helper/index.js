/* eslint-disable no-console */
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs');

const utils = require('./lib/utils');

const appArgs = process.argv.slice(2);
const myConfigPath = './script/cypress-testrail-helper/my-config.json'; // Project-root-relative path [for fs-call].

// Runtime variables.
let myConfig, specFile;

// Cypress run-specific config and run function
const configRunCySpec = appConfig => {
  console.log(chalk.yellow('CREATING CYPRESS RUN-SPECIFIC CONFIG-FILE NOW...'));
  utils
    .globSpecFiles()
    .then(files => {
      console.log(
        chalk.green('[configRunCySpec] spec file(s) returned:', files),
      );

      filesLength = files.length;
      console.log(
        chalk.green('[configRunCySpec] files array-length:', filesLength),
      );

      if (filesLength === 0) {
        console.log(chalk.red('NO FILES FOUND!  Please try again.'));
        configRunCySpec(myConfig);
      } else if (filesLength === 1) {
        specFile = files[0];
      } else {
        console.log('Multiple files found!');
        utils
          .chooseSpecFile(files)
          .then(file => {
            specFile = file;
          })
          .catch(err => {
            throw new Error(err);
          });
      }

      utils
        .getSpecTrInfo(specFile)
        .then(parsedTrInfo => {
          console.log('trInfo returned:', parsedTrInfo);
        })
        .catch(err => {
          console.log(chalk.red(`getSpecTrInfo failed! ${err}`));
        });
    })
    .catch(err => {
      console.log(chalk.red(`configRunCySpec failed! ${err}`));
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

    configRunCySpec(myConfig);
    break;
  case false:
    console.log(chalk.yellow('APP CONFIG-FILE MISSING -- CREATING ONE NOW...'));
    utils
      .setMyConfig(myConfig)
      .then(() => {
        myConfig = require('./my-config.json');
        console.log(chalk.green('APP CONFIG-FILE SUCCESSFULLY CREATED!'));
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
