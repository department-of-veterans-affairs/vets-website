const fs = require('fs');
const path = require('path');
const Table = require('cli-table');

const camelCase = str =>
  // Convert string to camel case
  str
    .replace(
      /(?:^\w|[A-Z]|\b\w)/g,
      (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()),
    )
    .replace(/-|\s/g, '');

const printCoverage = coverageResults => {
  // Create a new table with headers
  const coverageTable = new Table({
    head: ['Application', 'Lines', 'Functions', 'Statements', 'Branches'],
  });

  // Add each app coverage result to the table
  Object.keys(coverageResults).forEach(key => {
    if (key !== 'total') {
      coverageTable.push({
        [key]: [
          `${coverageResults[key].lines.pct}%`,
          `${coverageResults[key].functions.pct}%`,
          `${coverageResults[key].statements.pct}%`,
          `${coverageResults[key].branches.pct}%`,
        ],
      });
    }
  });

  /* eslint-disable no-console */
  console.log(coverageTable.toString());
};

const generateCoverageReport = (rootDir, coverageSummary) => {
  const appCoverages = {};

  // Iterate through each coverage result
  Object.keys(coverageSummary).forEach(key => {
    // Extract the application name from the coverage result & store in camel case
    const appName = camelCase(key.replace(rootDir, '').split(path.sep)[0]);
    const coverageResult = coverageSummary[key];

    // If there is an app name, add result to overall coverage
    if (appName) {
      // Average coverageResult with respective appCoverage segment if present
      if (appCoverages[appName]) {
        Object.keys(appCoverages[appName]).forEach(seg => {
          appCoverages[appName][seg].total += coverageResult[seg].total;
          appCoverages[appName][seg].covered += coverageResult[seg].covered;
          appCoverages[appName][seg].skipped += coverageResult[seg].skipped;
          appCoverages[appName][seg].pct = (
            (appCoverages[appName][seg].covered /
              appCoverages[appName][seg].total) *
            100
          ).toFixed(2);
        });
      } else {
        // Create new appCoverage entry
        Object.assign(appCoverages, { [appName]: coverageResult });
      }
    }
  });
  printCoverage(appCoverages);
};

// Root directory of application folders
const applicationDir = path.join(__dirname, '../src/applications/');

const coverageSummaryJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../coverage/coverage-summary.json')),
);

generateCoverageReport(applicationDir, coverageSummaryJson);
