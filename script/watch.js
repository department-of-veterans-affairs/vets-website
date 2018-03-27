const { fork } = require('child_process');
const { Writable } = require('stream');
const chokidar = require('chokidar');
const util = require('util');
const glob = util.promisify(require('glob'));
const chalk = require('chalk');
const _ = require('lodash');

console.log(chalk.cyan('Performing initial set up'));

const showErrors = process.argv.includes('showErrors');
let watcher;
let busy = false;
let pendingTests = [];

// all unit test files
const allUnitTests = glob.sync('test/**/*.unit.spec.js?(x)');

// runs array of test files passed in or all tests if no value provided
async function runUnitTests(unitTests = allUnitTests) {
  if (busy) {
    pendingTests = _.union(pendingTests, unitTests);
    return;
  }
  console.log(chalk.cyan(`Running ${unitTests.length} unit test files`));

  // watchedFiles: all of the project files that mocha required (no node_modules)
  // list of source files and their associated unit tests
  busy = true;
  const {
    watchedFiles,
    unitTestsForSrc
  } = await runMochaTests(unitTests);
   busy = false;
  if (pendingTests.length > 0) {
    busy = false;
    process.nextTick(() => {
      runUnitTests(pendingTests);
      pendingTests = [];
    });
    console.log(chalk.yellow('Changes detected during last run.'));
    console.log(chalk.yellow('======'));
    return;
  } else {
    console.log(chalk.yellow('Watching for changes'));
    console.log(chalk.yellow('======\n\n'));
  };


  // watcher is only created once- if new files are added, then watcher must be restarted
  if (!watcher) {
    // start watcher with the files that mocha imported
    watcher = chokidar.watch(watchedFiles).
      on('change', file => {
        // if a unit test is updated just run that unit test
        if (file.includes('.unit.spec')) {
          runUnitTests([file]);
        }

        // if change is from a src file, run unit tests that import that src file
        if (file.includes('src') && unitTestsForSrc[file]) {
          runUnitTests(unitTestsForSrc[file]);
        } else {
          // if no unit tests import src file, run all unit tests
          runUnitTests();
        }
      });
  }
}

function runMochaTests(tests) {
  // fork mocha into a separate process
  const forked = fork('./script/mocha.js');

  return new Promise((fulfill, reject) => {
    // send the mocha process the tests to run
    forked.send({
      tests,
      showErrors
    });
    forked.on('message', (requiredProjectFiles) => {
      // sent the watcher the files to watch
      fulfill(requiredProjectFiles);
      // kill mocha
      forked.kill('SIGHUP');
    });
  });
}

runUnitTests();
