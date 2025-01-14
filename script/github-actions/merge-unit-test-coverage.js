/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

const fs = require('fs');

const coverageResultsFiles = process.argv.slice(2);

const mergeResults = files => {
  const mergedResults = {
    total: {
      lines: { total: 0, covered: 0, skipped: 0 },
      statements: { total: 0, covered: 0, skipped: 0 },
      functions: { total: 0, covered: 0, skipped: 0 },
      branches: { total: 0, covered: 0, skipped: 0 },
    },
  };

  files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));

    Object.entries(data).forEach(([filePath, coverageData]) => {
      const match = filePath.match(/applications\/(?:[^/]+\/[^/]+|[^/]+)\//);

      if (!match) {
        return;
      }

      const directoryKey = match[0];

      if (!mergedResults[directoryKey]) {
        mergedResults[directoryKey] = {
          lines: { total: 0, covered: 0, skipped: 0 },
          statements: { total: 0, covered: 0, skipped: 0 },
          functions: { total: 0, covered: 0, skipped: 0 },
          branches: { total: 0, covered: 0, skipped: 0 },
        };
      }

      const directoryCoverage = mergedResults[directoryKey];
      ['lines', 'statements', 'functions', 'branches'].forEach(key => {
        directoryCoverage[key].total += coverageData[key].total;
        directoryCoverage[key].covered += coverageData[key].covered;
        directoryCoverage[key].skipped += coverageData[key].skipped;

        mergedResults.total[key].total += coverageData[key].total;
        mergedResults.total[key].covered += coverageData[key].covered;
        mergedResults.total[key].skipped += coverageData[key].skipped;
      });
    });
  });

  Object.values(mergedResults).forEach(coverageData => {
    ['lines', 'statements', 'functions', 'branches'].forEach(key => {
      coverageData[key].pct = (
        (coverageData[key].covered / coverageData[key].total) *
        100
      ).toFixed(2);
    });
  });

  return mergedResults;
};

const results = mergeResults(coverageResultsFiles);
fs.writeFileSync(
  'merged-coverage-report.json',
  JSON.stringify(results, null, 2),
  'utf8',
);

console.log('Merged results saved to mergedResults.json');
