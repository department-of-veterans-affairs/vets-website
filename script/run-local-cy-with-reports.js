/* eslint-disable no-console */
/* run-local-cy-with-reports.js
  * Script to run Cypress tests locally with mochawesome reports
  * yarn cy:run:localreport --spec "your-spec-files-global-pattern"
  */
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const cheerio = require('cheerio');
const { execSync } = require('child_process');
const chalk = require('chalk');
const cyLocalReportsHtml = require('./cyLocalReportsHtml');

// Get --spec parameter from command line arguments
let spec = '';
const specArgIndex = process.argv.findIndex(arg => arg === '--spec');
if (specArgIndex !== -1 && process.argv[specArgIndex + 1]) {
  spec = process.argv[specArgIndex + 1];
} else {
  const specArg = process.argv.find(arg => arg.startsWith('--spec='));
  spec = specArg ? specArg.split('=')[1] : '';
}
console.log(chalk.yellow(`RUNNING CYPRESS WITH LOCAL REPORTS --spec: ${spec}`));

// Delete all output from previous test-runs
try {
  rimraf.sync('cypress/*');
  rimraf.sync('mochawesome-report/*');
  console.log(chalk.green('Old test-output files deleted.'));
} catch (error) {
  console.error(chalk.red('Error deleting old test-output files:', error));
}

// Run Cypress tests
try {
  execSync(
    `npx cypress run --config-file config/cypress-local-with-report.config.js ${
      spec ? `--spec "${spec}"` : ''
    }`,
    {
      stdio: 'inherit',
    },
  );
} catch (error) {
  console.error(chalk.red('Cypress tests failed:', error));
}

// Rename generated HTML report-files with spec filenames
let htmlFiles1;
let data;
try {
  htmlFiles1 = fs
    .readdirSync('mochawesome-report')
    .filter(file => !file.startsWith('index') && file.endsWith('.html'));
  console.log(chalk.green(`Report-files found: ${htmlFiles1}`));
} catch (error) {
  console.error(chalk.red('Error reading report-files:', error));
}
htmlFiles1.forEach(file => {
  const filePath = path.join('mochawesome-report', file);
  let content;
  let dataRaw;
  let $;
  let fileName;

  try {
    content = fs.readFileSync(filePath, 'utf8');
    $ = cheerio.load(content);
    dataRaw = $('body').attr('data-raw');
    data = JSON.parse(decodeURIComponent(encodeURIComponent(dataRaw)));
    fileName = data.results[0].file
      .split('/')
      .pop()
      .replace(/\.cypress\.spec\.js(x)?$/, '');
    if (fileName) {
      fs.renameSync(
        filePath,
        path.join('mochawesome-report', `${fileName}.html`),
      );
      console.log(chalk.green(`Report-file ${file} renamed: ${fileName}.html`));
    }
  } catch (error) {
    console.error(chalk.red(`Error renaming report-files:`, error));
  }
});

// Generate index.html
try {
  const htmlFiles2 = fs
    .readdirSync('mochawesome-report')
    .filter(file => !file.startsWith('index') && file.endsWith('.html'));
  const htmlContent = cyLocalReportsHtml(
    htmlFiles2,
    // passes,
    // failures,
    // skipped,
    // pending,
  );
  fs.writeFileSync(path.join('mochawesome-report', 'index.html'), htmlContent);
  console.log(
    chalk.green(`Index generated for renamed report-files: ${htmlFiles2}`),
  );
} catch (error) {
  console.error(chalk.red('Error generating index:', error));
}
/* eslint-enable no-console */
