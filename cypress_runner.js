const cypress = require('cypress');
const yargs = require('yargs');
const { merge } = require('mochawesome-merge');
const marge = require('mochawesome-report-generator');
const rm = require('rimraf');
const cypressConfig = require('./config/cypress.json');
const ls = require('ls');

const argv = yargs
  .options({
    configFile: {
      alias: 'C',
      describe: 'path to config file',
      default: 'config/cypress.json',
    },
    browser: {
      alias: 'b',
      describe: 'choose browser that you want to run tests on',
      default: 'chrome',
      choices: ['chrome', 'electron'],
    },
    spec: {
      alias: 's',
      describe: 'run test with specific spec file',
      default: 'src/applications/**/tests/**/*.cypress.spec.js?(x)', // check this
    },
  })
  .help().argv;

const reportDir = cypressConfig.reporterOptions.reportDir;
const reportFiles = `${reportDir}/*.json`;
// list all of existing report files
/* eslint-disable no-console */
ls(reportFiles, { recurse: true }, file =>
  console.log(`removing ${file.full}`),
);
/* eslint-enable no-console */

// delete all existing report files
rm(reportFiles, error => {
  /* eslint-disable no-console */
  if (error) {
    console.error(`Error while removing existing report files: ${error}`);
    process.exit(1);
  }

  console.log('Removing all existing report files successfully!');
  /* eslint-enable no-console */
});

function generateReport(options) {
  return merge(options).then(report => {
    marge.create(report, options);
  });
}

cypress
  .run({
    configFile: argv.configFile,
    browser: argv.browser,
    spec: argv.spec,
  })
  .then(results => {
    const reporterOptions = {
      reportDir: results.config.reporterOptions.reportDir,
    };
    generateReport(reporterOptions);
  })
  .catch(error => {
    /* eslint-disable no-console */
    console.error('errors: ', error);
    /* eslint-enable no-console */

    process.exit(1);
  });
