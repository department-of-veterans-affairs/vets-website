const fs = require('fs');
const path = require('path');
const Table = require('cli-table');

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

  console.log(coverageTable.toString()); // eslint-disable-line
};

const generateCoverage = (rootDir, coverageSummary) =>
  Object.keys(coverageSummary).reduce((acc, coverageResult) => {
    const appName = coverageResult.replace(rootDir, '').split(path.sep)[0];
    // If appName exists, add coverageResult to overall coverage
    if (appName) {
      if (acc[appName]) {
        // Average coverageResult with respective acc segment if present
        // Each 'seg' represents coverage by line, function, statement, and branch
        Object.keys(acc[appName]).forEach(seg => {
          acc[appName][seg].total += coverageSummary[coverageResult][seg].total;
          acc[appName][seg].covered +=
            coverageSummary[coverageResult][seg].covered;
          acc[appName][seg].skipped +=
            coverageSummary[coverageResult][seg].skipped;
          acc[appName][seg].pct = (
            (acc[appName][seg].covered / acc[appName][seg].total) *
            100
          ).toFixed(2);
        });
      } else {
        // Create new coverageResult entry
        Object.assign(acc, {
          [appName]: coverageSummary[coverageResult],
        });
      }
    }
    return acc;
  }, {});

// Root directory of application folders
const applicationDir = path.join(__dirname, '../src/applications/');

const coverageSummaryJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../coverage/coverage-summary.json')),
);

const appCoverage = generateCoverage(applicationDir, coverageSummaryJson);
printCoverage(appCoverage);
