/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const Table = require('cli-table');
const { getAppManifests } = require('../config/manifest-helpers');

const printCoverage = coverageResults => {
  // Create a new table with headers
  const coverageTable = new Table({
    head: [
      'Application (src/applications)',
      'Lines',
      'Functions',
      'Statements',
      'Branches',
    ],
  });

  // Add each app coverage result to the table
  Object.values(coverageResults).forEach(cov => {
    const appLocation = cov.path.substr(0, cov.path.lastIndexOf('/'));

    coverageTable.push({
      [appLocation]: [
        `${cov.lines.pct}%`,
        `${cov.functions.pct}%`,
        `${cov.statements.pct}%`,
        `${cov.branches.pct}%`,
      ],
    });
  });

  console.log(coverageTable.toString());
};

const generateCoverage = (rootDir, coverageSummary) => {
  // Get application manifests & entry names
  const manifests = getAppManifests(path.join(__dirname, '../'));

  // Set initial coverage object
  const initialCoverage = Object.assign(
    ...manifests.map(({ entryName, entryFile }) => ({
      [entryName]: {
        path: entryFile.replace(rootDir, ''),
        lines: { total: 0, covered: 0, pct: 0 },
        statements: { total: 0, covered: 0, pct: 0 },
        functions: { total: 0, covered: 0, pct: 0 },
        branches: { total: 0, covered: 0, pct: 0 },
      },
    })),
  );

  // Iterate through coverages that are under src/applications
  return Object.keys(coverageSummary)
    .filter(fullPath => fullPath.includes('src/applications'))
    .reduce((acc, fullCoveragePath) => {
      // Find coverage if it exists by checking if the path of the coverage result file
      // includes an application path, e.g. 'vre/chapter36/'
      const coverageItem = Object.values(acc).find(appCov =>
        fullCoveragePath.includes(
          `${appCov.path.substring(0, appCov.path.lastIndexOf('/'))}/`,
        ),
      );

      // Average coverageResult with respective coverageItem segment if present
      // Each 'seg' represents coverage by line, function, statement, and branch
      Object.keys(coverageItem || {}).forEach(seg => {
        if (seg !== 'path') {
          coverageItem[seg].total +=
            coverageSummary[fullCoveragePath][seg].total;
          coverageItem[seg].covered +=
            coverageSummary[fullCoveragePath][seg].covered;
          coverageItem[seg].pct = (
            (coverageItem[seg].covered / coverageItem[seg].total) * 100 || 0
          ).toFixed(2);
        }
      });
      return acc;
    }, initialCoverage);
};

// Root directory of application folders
const applicationDir = path.join(__dirname, '../src/applications/');

// Check if coverage-summary.json exists before generating coverage
if (fs.existsSync(path.join(__dirname, '../coverage/coverage-summary.json'))) {
  const coverageSummaryJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../coverage/coverage-summary.json')),
  );
  // Generate and print coverage
  const appCoverages = generateCoverage(applicationDir, coverageSummaryJson);
  printCoverage(appCoverages);
} else {
  console.log('./coverage/coverage-summary.json not found.');
}
