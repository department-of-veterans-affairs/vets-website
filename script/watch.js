// babel-register only looks for environment variables
process.env.BABEL_ENV = process.env.BABEL_ENV || 'test';
// use babel-register to compile files on the fly
require('babel-register');

// require mocha setup files
require('../test/util/mocha-setup.js');
require('../test/util/enzyme-setup.js');

const { Writable } = require('stream');
const chokidar = require('chokidar');
const CLIEngine = require('eslint').CLIEngine;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const glob = util.promisify(require('glob'));

const eslint = new CLIEngine();
const formatter = eslint.getFormatter('stylish');
const sasslinter = require('sass-lint');
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

const watchArray = [
  './src/**/*.jsx',
  './src/**/*.js',
  './test/**/*.unit.spec.*'
];

if (options.sassLint) {
  watchArray.push('./src/**/*.scss');
}

const srcWatcher = chokidar.watch(watchArray);

async function runTests() {
  const groupedFiles = groupFilesByTest(await getChangedFiles());

  if (options.unit) {
    const unitTests = groupedFiles.mocha.length > 0 ?
      groupedFiles.mocha :
      await glob('test/**/*.unit.spec.js?(x)');
    console.log(`Running Mocha with ${unitTests.length} Files\n`);
    // mocha requires flushing the require cache of all js files (tests and imports)
    groupedFiles.eslint.forEach(file => delete require.cache[file]);
    await runMochaTests(unitTests);
  }

  if (options.eslint) {
    const eslintTargets = groupedFiles.eslint.length > 0 ?
      groupedFiles.eslint :
      await glob('+(src|test)/**/*.js?(x)');
    console.log(`Running Eslint with ${eslintTargets.length} Files\n`);
    eslintFiles(eslintTargets);
  }

  if (options.sasslint) {
    const sasslintTargets = groupedFiles.sasslint.length > 0 ?
      groupedFiles.sasslint :
      await glob('./**/*.scss');

    console.log(`Running sassLint with ${sasslintTargets.length} Files\n`);
    sasslintFiles(sasslintTargets);
  }

  console.log(chalk.cyan('Watching for changes'));
}

function groupFilesByTest(files) {
  return files.reduce((groupedFiles, file) => {
    if (file.includes('.unit.spec')) {
      groupedFiles.mocha.push(file);
    }

    if (!file.includes('src') && !file.includes('test')) {
      return groupedFiles;
    }

    switch(path.extname(file)) {
      case '.js':
      case '.jsx':
        groupedFiles.eslint.push(file);
        break;
      case '.scss':
        groupedFiles.sasslint.push(file);
        break;
      default:
    }
    return groupedFiles;

  }, { eslint: [], mocha: [], sasslint: [] } );
}

async function getChangedFiles() {
  const projectRoot = path.resolve();
  // use gitDiffIndex to limit tests that are run to changed files
  const gitDiffIndex = await exec('git diff-index --name-only HEAD');
  return gitDiffIndex.stdout.split('\n').map(file => path.join(projectRoot, file));
}

async function runMochaTests(files) {
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

  const mocha = new Mocha({ignoreLeaks: true});
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

function eslintFiles(files) {
  const eslintResults = eslint
    .executeOnFiles(files)
    .results
    .filter(result => options.showErrors || result.errorCount > 0);
  console.log(formatter(eslintResults) || chalk.green(`${files.length} js files lint free`));
}

function sasslintFiles(files) {
  const sasslintResults = _.flattenDeep(files.map(sassFile =>
    sasslinter.lintFiles(`./${sassFile}`, {}, './config/sass-lint.yml')
  ));
  console.log(formatter(sasslintResults) || chalk.green(`${files.length} scss files lint free`));
}

// ensures errors that blow up test watcher make it to console reporter
process.on('uncaughtException', function(err) {
  console.error((err && err.stack) ? err.stack : err);
});
srcWatcher.on('change', runTests);
runTests();
