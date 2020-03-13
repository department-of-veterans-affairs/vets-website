/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const Table = require('cli-table');
const {
  getAppManifests,
} = require('../src/site/stages/build/webpack/manifest-helpers');

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
  Object.keys(coverageResults).forEach(key => {
    if (key !== 'total') {
      const appLocation = `${coverageResults[key].path.substr(
        0,
        coverageResults[key].path.lastIndexOf('/'),
      )}`;

      coverageTable.push({
        [appLocation]: [
          `${coverageResults[key].lines.pct}%`,
          `${coverageResults[key].functions.pct}%`,
          `${coverageResults[key].statements.pct}%`,
          `${coverageResults[key].branches.pct}%`,
        ],
      });
    }
  });

  console.log(coverageTable.toString());
};

const generateCoverage = (rootDir, coverageSummary) => {
  // Get application manifests & entry names
  const manifests = getAppManifests(path.join(__dirname, '../'));
  const entryNames = manifests.map(manifest => manifest.entryName);

  // Set initial coverage object
  const initialCoverage = Object.assign(
    ...entryNames.map(entryName => ({
      [entryName]: {
        path: manifests
          .find(obj => obj.entryName === entryName)
          .entryFile.replace(rootDir, ''),
        lines: { total: 0, covered: 0, skipped: 0, pct: 0 },
        statements: { total: 0, covered: 0, skipped: 0, pct: 0 },
        functions: { total: 0, covered: 0, skipped: 0, pct: 0 },
        branches: { total: 0, covered: 0, skipped: 0, pct: 0 },
      },
    })),
  );

  return Object.keys(coverageSummary).reduce((acc, coverageResult) => {
    const appName = coverageResult.replace(rootDir, '').split(path.sep)[0];

    if (appName) {
      // Find coverage if it exists by checking if the path of the coverage result file
      // includes an application path, e.g. 'vre/chapter36/'
      const resultFilePath = coverageResult.replace(rootDir, '');
      const coverageItem = Object.values(acc).find(appCov =>
        resultFilePath.includes(
          `${appCov.path.substring(0, appCov.path.lastIndexOf('/'))}/`,
        ),
      );

      // Get key of coverageItem
      const coverageKey = Object.keys(acc).find(
        key => acc[key] === coverageItem,
      );

      // Update coverage
      if (acc[coverageKey]) {
        // Average coverageResult with respective acc segment if present
        // Each 'seg' represents coverage by line, function, statement, and branch
        Object.keys(acc[coverageKey]).forEach(seg => {
          if (seg !== 'path') {
            acc[coverageKey][seg].total +=
              coverageSummary[coverageResult][seg].total;
            acc[coverageKey][seg].covered +=
              coverageSummary[coverageResult][seg].covered;
            acc[coverageKey][seg].skipped +=
              coverageSummary[coverageResult][seg].skipped;
            acc[coverageKey][seg].pct = (
              (acc[coverageKey][seg].covered / acc[coverageKey][seg].total) *
                100 || 0
            ).toFixed(2);
          }
        });
      }
    }
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
