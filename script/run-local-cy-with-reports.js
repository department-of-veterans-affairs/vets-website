/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const cheerio = require('cheerio');
const { execSync } = require('child_process');

// Get the --spec parameter from the command line arguments
let spec = '';
const specArgIndex = process.argv.findIndex(arg => arg === '--spec');
if (specArgIndex !== -1 && process.argv[specArgIndex + 1]) {
  spec = process.argv[specArgIndex + 1];
} else {
  const specArg = process.argv.find(arg => arg.startsWith('--spec='));
  spec = specArg ? specArg.split('=')[1] : '';
}
console.log(`Running Cypress tests with --spec: ${spec}`);

// Delete all previously generated test-results
// Set folder paths relative to this script
try {
  console.log('Deleting old report output files');
  rimraf.sync('cypress/*');
  rimraf.sync('mochawesome-report/*');
} catch (error) {
  console.error('Error deleting files:', error);
}

// Run Cypress tests
execSync(
  `npx cypress run --config-file config/cypress-local-with-report.config.js ${
    spec ? `--spec "${spec}"` : ''
  }`,
  {
    stdio: 'inherit',
  },
);

// Rename all generated HTML report-files with suite-titles
const htmlFiles1 = fs
  .readdirSync('mochawesome-report')
  .filter(file => !file.startsWith('index') && file.endsWith('.html'));

htmlFiles1.forEach(file => {
  const filePath = path.join('mochawesome-report', file);
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  const dataRaw = $('body').attr('data-raw');

  // Extract suite title from body tag's data-raw attribute
  let data;
  try {
    data = JSON.parse(decodeURIComponent(dataRaw));
  } catch (error) {
    console.error(`Error parsing JSON from data-row in file ${file}:`, error);
    return;
  }

  const suiteName = data.results[0].suites[0].title.replace(/ /g, '_');
  console.log(`suiteName: ${suiteName}`);

  if (suiteName) {
    fs.renameSync(
      filePath,
      path.join('mochawesome-report', `${suiteName}.html`),
    );
  }
});

// Get a list of all HTML files in the mochawesome-report directory
const htmlFiles2 = fs
  .readdirSync('mochawesome-report')
  .filter(file => !file.startsWith('index') && file.endsWith('.html'));
console.log(`Renamed HTML report-files: ${htmlFiles2}`);

// Generate an index.html with links to above HTML files
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Cypress test-results</title>
</head>
<body>
  <h1>Cypress test-results</h1>
  ${htmlFiles2
    .map(
      file =>
        `<p><a href="${file}">${file
          .replace(/_/g, ' ')
          .replace('.html', '')}</a></p>`,
    )
    .join('\n')}
</body>
</html>
`;

// Write the HTML content to an index.html file
fs.writeFileSync(path.join('mochawesome-report', 'index.html'), htmlContent);
/* eslint-enable no-console */
