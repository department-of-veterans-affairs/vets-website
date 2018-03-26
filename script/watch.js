// babel-register only looks for environment variables
process.env.BABEL_ENV = process.env.BABEL_ENV || 'test';
// use babel-register to compile files on the fly
require('babel-register');

// require mocha setup files
require('../test/util/mocha-setup.js');
require('../test/util/enzyme-setup.js');

const { Writable } = require('stream');
const chokidar = require('chokidar');
const uncache = require('recursive-uncache');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const glob = util.promisify(require('glob'));

const Mocha = require('mocha');

const chalk = require('chalk');
const path = require('path');
const _ = require('lodash');

// no arguments, run unit tests
// any arguments provited then tests run must be explicitly provided
let options;
if (process.argv.length === 2) {
  options= {
    eslint: false,
    sasslint: false,
    showErrors: false,
    unit: true
  };
} else {
  options = {
    eslint: process.argv.includes('eslint'),
    sasslint: process.argv.includes('sasslint'),
    showErrors: process.argv.includes('showErrors'),
    unit: process.argv.includes('unit')
  };
}

const unwatchedModules = Object.keys(require.cache).map(file => file);
let watcher;

async function runUnitTests(tests) {
  const unitTests = tests || await glob('test/**/*.unit.spec.js?(x)')
  console.log(chalk.cyan(`Running ${unitTests.length} unit test files`));

  await runMochaTests(unitTests);

  console.log(chalk.red('Watching for changes'));

  if (!watcher) {
    const watchedFiles = Object.keys(require.cache).filter(file => !unwatchedModules.includes(file) && !file.includes('node_modules'));
    const unitTestsForSrc = getUnitTestsForSrc(watchedFiles);
    watcher = chokidar.watch(watchedFiles).
      on('change', file => {
        if (file.includes('.unit.spec')) {
          uncache(file);
          runUnitTests([file]);
        }

        if (file.includes('src')) {
          unitTestsForSrc[file].forEach(unitTest => uncache(unitTest));
          runUnitTests(unitTestsForSrc[file]);
        }
      });
  }
}


function getUnitTestsForSrc(watchedFiles) {
  return watchedFiles
  .filter(file => file.includes('test'))
  .reduce((acc, testFile) => {
    const requiredSourceFiles = require.cache[testFile]
      .children
      .forEach(childModule => {
        if (!childModule.id.includes('src')) {
          return;
        }
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
  console.log(chalk.yellow('Mocha starting'));
  if (files.length < 10) files.forEach(file => console.log(chalk.blue(path.basename(file))));
  // keep errors from polluting the reporter by redirecting the error stream
  let errorStream;
  const consoleErr = process.stderr.write;
  if (!options.showErrors) {
    errorStream = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });
    process.stderr.write = errorStream;
  }

  const mocha = new Mocha();
  mocha.reporter('nyan');
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
