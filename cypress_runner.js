// from https://medium.com/cypress-io-thailand/generate-a-beautiful-test-report-from-running-tests-on-cypress-io-371c00d7865a

const cypress = require('cypress');
const yargs = require('yargs');
const { merge } = require('mochawesome-merge');
const reportGenerator = require('mochawesome-report-generator');
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
      describe: 'the browser you want to run tests on',
      default: 'chrome',
      choices: ['chrome', 'electron'],
    },
    spec: {
      alias: 's',
      describe: 'path to spec files',
      default: 'src/applications/**/tests/**/*.cypress.spec.js?(x)',
    },
  })
  .help().argv;

const reportDir = cypressConfig.reporterOptions.reportDir;
const reportFiles = `${reportDir}/*.json`;

const generateReport = options => {
  return merge(options).then(report => {
    // to-do: convert report to json and save it to file
    reportGenerator.create(report, options);
  });
};

ls(reportFiles, { recurse: true }, file => {
  /* eslint-disable no-console */
  console.log(`removing ${file.full}`);
  /* eslint-enable no-console */
});

// delete all existing report files
rm(reportFiles, error => {
  /* eslint-disable no-console */
  if (error) {
    console.error(`Error while removing existing report files: ${error}`);
    process.exit(1);
  }

  console.log('Removed all existing report files successfully!');
  /* eslint-enable no-console */
});

cypress
  .run({
    configFile: argv.configFile,
    browser: argv.browser,
    spec: argv.spec,
  })
  .then(results => {
    const reporterOptions = {
      files: [`${results.config.reporterOptions.reportDir}/*.json`],
    };

    generateReport(reporterOptions);
  })
  .catch(error => {
    /* eslint-disable no-console */
    console.error('errors: ', error);
    /* eslint-enable no-console */

    process.exit(1);
  });
