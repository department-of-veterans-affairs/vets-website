const cypress = require('cypress');
const { writeFileSync } = require('fs');
const yargs = require('yargs');
const { merge } = require('mochawesome-merge');
const reportGenerator = require('mochawesome-report-generator');
const rm = require('rimraf');
const ls = require('ls');

const argv = yargs
  .options({
    browser: {
      alias: 'b',
      describe: 'the browser you want to run tests on',
      default: 'electron',
      choices: ['chrome', 'chromium', 'edge', 'electron', 'firefox'],
    },
    spec: {
      alias: 's',
      describe: 'path to spec files',
      default: 'src/applications/**/tests/**/*.cypress.spec.js?(x)',
    },
  })
  .help().argv;

const reportDir = 'cypress/report/mochawesome-report';
const reportFiles = `${reportDir}/*.json`;

const generateReport = options => {
  return merge(options).then(report => {
    try {
      writeFileSync(
        `${reportDir}/mochawesome.json`,
        JSON.stringify(report, null, 2),
        'utf8',
      );
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err);
      /* eslint-enable no-console */
    }

    // we can delete the following when we don't want to generate the html report
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
    configFile: 'config/cypress.json',
    browser: argv.browser,
    spec: argv.spec,
  })
  .then(() => {
    const reporterOptions = {
      files: [`${reportDir}/*.json`],
    };

    generateReport(reporterOptions);
  })
  .catch(error => {
    /* eslint-disable no-console */
    console.error('errors: ', error);
    /* eslint-enable no-console */

    process.exit(1);
  });
