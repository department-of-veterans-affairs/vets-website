/* eslint-disable no-console */
/* run-local-cy-with-reports.js
  * Script to run an app's Cypress specs locally with mochawesome reports
  * Usage:
  * yarn cy:run:localreports my-app-folder
  */
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const cheerio = require('cheerio');
const { execSync } = require('child_process');
const chalk = require('chalk');

const cyLocalReportsHtml = require('./get-cy-local-reports-index');

// Get required spec-files parameter from command line arguments
const appFolder = process.argv[2] || '';
if (!appFolder) {
  console.error(
    chalk.red(
      'ERROR: No app-folder parameter provided. You MUST provide an app-folder directly after the script name.',
    ),
  );
  console.log(
    chalk.yellow(
      'Usage:\nyarn cy:run:localreports appeals/995\nyarn cy:run:localreports ask-a-question',
    ),
  );
  process.exit(1);
} else {
  console.log(
    chalk.yellow(`RUNNING CYPRESS WITH LOCAL REPORTS. appFolder: ${appFolder}`),
  );
}

// Delete all output from previous test-runs
try {
  rimraf.sync('cypress/*');
  rimraf.sync('mochawesome-report/*');
  console.log(chalk.green('Old test-output files deleted.'));
} catch (error) {
  console.error(chalk.red('Error deleting old test-output files:', error));
}

// Run Cypress tests with HTML & JSON reports
try {
  const sanitizedappFolder = appFolder ? JSON.stringify(appFolder) : '';
  execSync(
    `npx cypress run --config-file config/cy-local-reports/cy-local-with-reports.config.js --spec "src/applications/${sanitizedappFolder}/**/*"`,
    {
      stdio: 'inherit',
    },
  );
  console.log(chalk.green('Cypress tests completed.'));
} catch (error) {
  console.error(chalk.red('One or more Cypress tests failed:', error));
}

// Rename HTML-reports
try {
  const htmlFiles1 = fs
    .readdirSync('mochawesome-report')
    .filter(file => !file.startsWith('index') && file.endsWith('.html'));
  htmlFiles1.forEach(file => {
    const filePath = path.join('mochawesome-report', file);
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);
    const dataRaw = $('body').attr('data-raw');
    const data = JSON.parse(decodeURIComponent(encodeURIComponent(dataRaw)));
    const fileName = data.results[0].file
      .split('/')
      .pop()
      .replace(/\.cypress\.spec\.js(x)?$/, '');
    if (fileName) {
      fs.renameSync(
        filePath,
        path.join('mochawesome-report', `${fileName}.html`),
      );
    }
  });
  console.log(chalk.green('HTML-reports renamed.'));
} catch (error) {
  console.error(chalk.red(`Error renaming HTML-reports:`, error));
}

// Generate index.html
try {
  const htmlFiles2 = fs
    .readdirSync('mochawesome-report')
    .filter(file => !file.startsWith('index') && file.endsWith('.html'));
  const htmlContent = cyLocalReportsHtml(htmlFiles2);
  fs.writeFileSync(path.join('mochawesome-report', 'index.html'), htmlContent);
  console.log(
    chalk.green(`Index generated for renamed HTML-reports: ${htmlFiles2}`),
  );
} catch (error) {
  console.error(chalk.red('Error generating index:', error));
}

// Merge JSON report-files
try {
  execSync(
    'npx mochawesome-merge ./mochawesome-report/*.json > mochawesome-report/combined-report.json',
    {
      stdio: 'inherit',
    },
  );
  console.log(chalk.green('JSON-reports merged.'));
} catch (error) {
  console.error(chalk.red('Error merging JSON-reports:', error));
}

// Generate Markdown-report
try {
  execSync(
    'npx mochawesome-json-to-md -p mochawesome-report/combined-report.json -o mochawesome-report/combined-report.md -t config/cy-local-reports/cy-local-reports-template.md',
    {
      stdio: 'ignore',
    },
  );
  console.log(chalk.green('Markdown-report generated.'));
} catch (error) {
  console.error(chalk.red('Markdown-report generation failed:', error));
}

// Rewrite Markdown test-links
try {
  const githubMainDir =
    'https://github.com/department-of-veterans-affairs/vets-website/blob/main/';
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const filePath = path.join(
    __dirname,
    '..',
    'mochawesome-report',
    'combined-report.md',
  );
  let fileContent = fs.readFileSync(filePath, 'utf8');
  fileContent = fileContent.replace(markdownLinkRegex, (match, text, url) => {
    const unescapedUrl = decodeURIComponent(
      `${githubMainDir}${url.replace(/&#x2F;/g, '/')}`,
    );
    return `[${text}](${unescapedUrl})`;
  });
  fs.writeFileSync(filePath, fileContent);
  console.log(chalk.green('Markdown test-links rewritten.'));
} catch (error) {
  console.error(chalk.red('Error rewriting Markdown test-links:', error));
}

// Delete original JSON-reports
try {
  const directory = './mochawesome-report';
  const files = fs.readdirSync(directory);
  files.forEach(file => {
    if (file.startsWith('mochawesome') && file.endsWith('.json')) {
      fs.unlinkSync(path.join(directory, file));
    }
  });
  console.log(chalk.green('Original JSON-reports deleted.'));
} catch (error) {
  console.error(chalk.red('Error deleting original JSON-reports:', error));
}

/* eslint-enable no-console */
