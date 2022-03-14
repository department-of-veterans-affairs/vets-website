/* eslint-disable no-console */
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const { Spinner } = require('cli-spinner');

let allCySpecs = [];
let cySpecsWithSkips = [];

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
  const regEx1 = /\.skip\(/;
  const regEx2 = /skip:(\s)*Cypress\.env\('CI'\)/;
  const lines = contents.toString().split('\n');
  const result = [];

  lines.forEach(line => {
    if (line && (line.search(regEx1) >= 0 || line.search(regEx2) >= 0)) {
      result.push(line);
    }
  });

  if (result.length) {
    return true;
  }

  return false;
};

const countSkippedSpecs = files => {
  const filesWithSkips = [];
  const cwd = process.cwd();

  return new Promise((resolve, reject) => {
    try {
      files.forEach(f => {
        const currFilePath = path.join(cwd, f);
        const contents = fs.readFileSync(currFilePath, { encoding: 'utf8' });

        if (specHasSkip(contents)) {
          filesWithSkips.push(f);
        }
      });
    } catch (error) {
      reject(error);
    }

    resolve(filesWithSkips);
  });
};

const spinner = new Spinner('%s Counting...');
spinner.setSpinnerString(18);
spinner.start();

countCySpecs().then(
  allFiles => {
    allCySpecs = allFiles;
    spinner.stop(true);
    console.info('allCySpecs:', allCySpecs);
    console.info('---------------------------------\n');
    spinner.start();

    countSkippedSpecs(allFiles).then(
      filesWithSkips => {
        cySpecsWithSkips = filesWithSkips;
        spinner.stop(true);
        console.info('specsWithSkips:', cySpecsWithSkips);
        console.info('=================================\n');
        console.info(`CYPRESS SPECS TOTAL: ${allCySpecs.length}`);
        console.info(
          `Specs w/ skips: ${cySpecsWithSkips.length} (${(
            (cySpecsWithSkips.length / allCySpecs.length) *
            100
          ).toFixed(2)}%)`,
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
