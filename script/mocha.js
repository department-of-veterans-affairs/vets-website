const path = require('path');
const chalk = require('chalk');
const { Writable } = require('stream');
const mochaParallelTests = require('mocha-parallel-tests');

const showErrors = process.env.SHOW_ERRORS === 'true';

async function runMochaTests(files) {
  // show the file names if fewer than ten
  if (files.length < 10) {
    files.forEach(file => {
      let fileParts = path.basename(file).split('.');
      console.log(
        `${chalk.cyan(fileParts.shift())}.${chalk.blue(fileParts.join('.'))}`,
      );
    });
  }
  console.log(' ');

  // keep errors from polluting the reporter by redirecting the error stream
  let errorStream;
  if (!showErrors) {
    errorStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    });
    process.stderr.write = errorStream;
  }

  return new Promise((resolve, reject) => {
    console.log(chalk.green('Starting mocha (this can take a few seconds)...'));
    mochaParallelTests()
      .addFile('./src/platform/testing/unit/helpers.js')
      .addFiles(files) // add all test files
      .reporter('nyan')
      .run()
      .once('end', function() {
        // reattach error stream
        resolve();
      })
      .catch(error => {
        console.log(error);
        process.send({
          error,
        });
      });
  });
}

module.exports = runMochaTests;