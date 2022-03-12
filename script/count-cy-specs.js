/* eslint-disable no-console */
const fs = require('fs');
const glob = require('glob');
const path = require('path');

let allCySpecs = [];
let skippedCySpecs = [];

const countCySpecs = () => {
  return new Promise((resolve, reject) => {
    glob('**/*.cypress.spec.js?(x)', (error, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(files);
    });
  });
};

const specHasSkip = contents => {
  const regEx = /\.skip\(/;
  const lines = contents.toString().split('\n');
  const result = [];

  lines.forEach(line => {
    if (line && line.search(regEx) >= 0) {
      result.push(line);
    }
  });

  if (result.length) {
    return true;
  }

  return false;
};

const countSkippedSpecs = files => {
  const skippedFiles = [];
  const cwd = process.cwd();

  return new Promise((resolve, reject) => {
    try {
      files.forEach(f => {
        const currFilePath = path.join(cwd, f);
        const contents = fs.readFileSync(currFilePath, { encoding: 'utf8' });

        if (specHasSkip(contents)) {
          skippedFiles.push(f);
        }
      });
    } catch (error) {
      reject(error);
    }

    resolve(skippedFiles);
  });
};

countCySpecs().then(
  allFiles => {
    allCySpecs = allFiles;
    console.info('allCySpecs:', allCySpecs);
    console.info('---------------------------------\n');

    countSkippedSpecs(allFiles).then(
      skippedFiles => {
        skippedCySpecs = skippedFiles;
        console.info('skippedSpecs:', skippedCySpecs);
        console.info('=================================\n');
        console.info(`All specs total: ${allCySpecs.length}`);
        console.info(`Skipped specs total: ${skippedCySpecs.length}`);
        console.info(
          `Percentage skipped: ${(
            (skippedCySpecs.length / allCySpecs.length) *
            100
          ).toFixed(2)}%`,
        );
      },
      error => {
        console.error(`Something went wrong: ${error}`);
      },
    );
  },
  error => {
    console.error(`Something went wrong: ${error}`);
  },
);
/* eslint-enable no-console */
