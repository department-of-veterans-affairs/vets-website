const Mocha = require('mocha');
const { Writable } = require('stream');
const path = require('path');
const chalk = require('chalk');
// babel-register only looks for environment variables
process.env.BABEL_ENV = process.env.BABEL_ENV || 'test';
// use babel-register to compile files on the fly
// require('babel-register');
require("@babel/register");

// -----------------------------------------------------------------------------
// Node 22 polyfill: some legacy deps call require('node:stream') or similar.
// Older transpile hooks intercept the specifier and break.  Normalize by
// stripping the `node:` prefix for built-in modules during test runs only.
// -----------------------------------------------------------------------------
const Module = require('module');
const origLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (typeof request === 'string' && request.startsWith('node:')) {
    return origLoad.call(this, request.slice(5), parent, isMain);
  }
  return origLoad.apply(this, arguments);
};

// -----------------------------------------------------------------------------
// Shim Enzyme deep requires blocked by package.exports in modern cheerio/entities
// -----------------------------------------------------------------------------
try {
  const cheerioRoot = path.dirname(require.resolve('cheerio/package.json'));
  const entitiesRoot = path.dirname(require.resolve('parse5/node_modules/entities/package.json'));
  Module._load = function patchedLoad2(request, parent, isMain) {
    if (request === 'cheerio/lib/utils') {
      return origLoad(path.join(cheerioRoot, 'lib/utils.js'), parent, isMain);
    }
    if (request === 'entities/lib/decode.js') {
      return origLoad(path.join(entitiesRoot, 'lib/decode.js'), parent, isMain);
    }
    if (typeof request === 'string' && request.startsWith('node:')) {
      return origLoad(request.slice(5), parent, isMain);
    }
    return origLoad.apply(this, arguments);
  };
} catch (e) {
  // If cheerio/entities paths not found, skip shim.
}
require('babel-polyfill');
// require mocha setup files
require('../src/platform/testing/unit/mocha-setup.js');
require('../src/platform/testing/unit/enzyme-setup.js');

let showErrors = false;
// keys for current require.cache
const unwatchedModules = Object.keys(require.cache).map(file => file);

process.on('message', ({ tests, shouldShowErrors }) => {
  showErrors = shouldShowErrors;
  runMochaTests(tests).then(() => {
    // create a list of src and test files required by mocha
    const requiredFiles = Object.keys(require.cache).filter(
      file =>
        !unwatchedModules.includes(file) && !file.includes('node_modules'),
    );
    // send list of imported files and unit tests for each src file to the runner
    process.send({
      requiredFiles,
      unitTestsForSrc: getUnitTestsForSrc(requiredFiles),
    });
  });
});

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

  mocha = new Mocha();
  mocha.reporter('nyan');
  // sets up globals
  mocha.addFile('./src/platform/testing/unit/helpers.js');

  files.forEach(file => mocha.addFile(file));
  return new Promise((fulfill, reject) => {
    console.log(chalk.green('Starting mocha (this can take a few seconds)...'));
    mocha.run().once('end', function() {
      // reattach error stream
      fulfill();
    });
  }).catch(error => {
    console.log(error);
    process.send({
      error,
    });
  });
}

function getUnitTestsForSrc(requiredFiles) {
  return (
    requiredFiles
      // only use files in test directory
      .filter(file => file.includes('test'))
      // iterate over each test file
      .reduce((acc, testFile) => {
        // get the test files require.cache
        const requiredSourceFiles = require.cache[testFile].children // children is an array of modules the test file imports
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
      }, {})
  );
}

// ensures errors that blow up test watcher make it to console reporter
process.on('uncaughtException', function(err) {
  console.error(err && err.stack ? err.stack : err);
});
