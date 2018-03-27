const { Writable } = require('stream');
const chokidar = require('chokidar');
const uncache = require('recursive-uncache');
const util = require('util');
const glob = util.promisify(require('glob'));
const Mocha = require('mocha');
const chalk = require('chalk');
const path = require('path');
const _ = require('lodash');

console.log(chalk.cyan('Performing initial set up'));

// babel-register only looks for environment variables
process.env.BABEL_ENV = process.env.BABEL_ENV || 'test';
// use babel-register to compile files on the fly
require('babel-register');

// require mocha setup files
require('../test/util/mocha-setup.js');
require('../test/util/enzyme-setup.js');

const showErrors = process.argv.includes('showErrors');

// file watcher
let watcher;

// keys for current require.cache
const unwatchedModules = Object.keys(require.cache).map(file => file);

// all unit test files
const allUnitTests = glob.sync('test/**/*.unit.spec.js?(x)')

// runs array of test files passed in or all tests if no value provided
async function runUnitTests(unitTests = allUnitTests) {
  console.log(chalk.cyan(`Running ${unitTests.length} unit test files`));
  await runMochaTests(unitTests);

  console.log(chalk.yellow('Watching for changes'));
  console.log(chalk.yellow('======\n\n'));

  // watcher is only created once- if new files are added, then watcher must be restarted
  if (!watcher) {
    // watched files are all files added to the require cache after mocha was run
    // filters node_modules
    const watchedFiles = Object
      .keys(require.cache)
      .filter(file => !unwatchedModules.includes(file) && !file.includes('node_modules'));

    // use require cache to get list of unit tests that import each src file
    const unitTestsForSrc = getUnitTestsForSrc(watchedFiles);

    // start watcher
    watcher = chokidar.watch(watchedFiles).
      on('change', file => {
        // if change is from a unit test, recursively uncache and run that test file
        if (file.includes('.unit.spec')) {
          uncache(file);
          runUnitTests([file]);
        }

        // if change is from a src file, recursively uncache each unit test and run them all
        if (file.includes('src') && unitTestsForSrc[file]) {
          unitTestsForSrc[file].forEach(unitTest => uncache(unitTest));
          runUnitTests(unitTestsForSrc[file]);
        } else {
          console.log(chalk.yellow(`${path.basename(file)} changed - no unit tests found`));
        }
      });
  }
}


function getUnitTestsForSrc(watchedFiles) {
  return watchedFiles
  // only use files in test directory
    .filter(file => file.includes('test'))
  // iterate over each test file
    .reduce((acc, testFile) => {
      // get the test files require.cache
      const requiredSourceFiles = require.cache[testFile]
      // children is an array of modules the test file imports
        .children
        .forEach(childModule => {
          // filter anything that isn't in the src directory
          if (!childModule.id.includes('src')) {
            return;
          }

          // add the file path as a key to the accumulator
          // add the test file to the tests array
          if (acc[childModule.id]) {
            acc[childModule.id].push(testFile);
          } else {
            acc[childModule.id] = [testFile];
          }
        });

      return acc;

    }, {});
}

async function runMochaTests(files) {
  // show the file names if fewer than ten
  if (files.length < 10) {
    files.forEach(file => {
      let fileParts = path.basename(file).split('.');
      console.log(`${chalk.cyan(fileParts.shift())}.${chalk.blue(fileParts.join('.'))}`);
    });
  }
  console.log(' ');

  // keep errors from polluting the reporter by redirecting the error stream
  let errorStream;
  const consoleErr = process.stderr.write;
  if (!showErrors) {
    errorStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });
    process.stderr.write = errorStream;
  }

  const mocha = new Mocha();
  mocha.reporter('nyan');
  // sets up globals
  mocha.addFile('./test/helper.js');

  files.forEach(file => mocha.addFile(file));
  return new Promise ((fulfill, reject) => {
    mocha.run()
      .once('end', function() {
        // reattach error stream
        process.stderr.write = consoleErr;
        fulfill();
      });
  });
}

// ensures errors that blow up test watcher make it to console reporter
process.on('uncaughtException', function(err) {
  console.error((err && err.stack) ? err.stack : err);
});

runUnitTests();
