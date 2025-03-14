/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

const fs = require('fs');

function mergeJsonFiles(fileNames, outputFile) {
  const mergedData = {};

  fileNames.forEach(file => {
    try {
      const fileData = fs.readFileSync(file, 'utf8');
      const parsedData = JSON.parse(fileData);

      Object.entries(parsedData).forEach(([key, value]) => {
        if (
          Number(value.lines.pct) === 0 ||
          Number(value.functions.pct) === 0 ||
          Number(value.statements.pct) === 0 ||
          Number(value.branches.pct) === 0
        ) {
          console.log(`Excluding ${key} due to 0% coverage.`);
          return;
        }
        if (mergedData[key]) {
          console.warn(`Duplicate key detected: "${key}". Overwriting data.`);
        }
        mergedData[key] = value;
      });
    } catch (err) {
      console.error(`Error processing file: ${file} - ${err.message}`);
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2));
  console.log(`Merged JSON written to: ${outputFile}`);
}

const coverageResultsFiles = process.argv.slice(2);

const outputFileName = 'merged-coverage-report.json';

mergeJsonFiles(coverageResultsFiles, outputFileName);
