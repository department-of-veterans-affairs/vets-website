/* eslint-disable no-console, no-await-in-loop */

const path = require('path');
const cp = require('child_process');

// const ignoreSpecialPages = require('./helpers/ignoreSpecialPages');
const getErrorOutput = require('./helpers/getErrorOutput');

const WORKER_MODULE_PATH = path.join(__dirname, '/helpers/executeAxeCheck');

function getHtmlFileList(files) {
  return Object.keys(files)
    .filter(fileName => path.extname(fileName) === '.html')
    .map(fileName => files[fileName])
    .filter(file => !file.private);
}

function processNextHtmlFile(
  buildOptions,
  htmlFiles,
  workerPool,
  worker,
  done,
) {
  if (htmlFiles.length === 0) {
    const workerIndex = workerPool.indexOf(worker);
    workerPool.splice(workerIndex, 1);
    worker.kill();

    if (workerPool.length === 0) {
      console.timeEnd('Accessibility');
      console.log('done!');
      done();
    }

    return;
  }

  const nextFile = htmlFiles.shift();

  worker.send({
    url: new URL(nextFile.path, buildOptions.hostUrl),
    contents: nextFile.contents.toString(),
  });
}

function checkAccessibility(buildOptions) {
  return async (files, metalsmith, done) => {
    console.log('Starting accessibility tests...');
    console.time('Accessibility');

    const htmlFiles = getHtmlFileList(files);
    const numWorkers = 4;
    const workerPool = [];

    for (let i = 0; i < numWorkers; i++) {
      const worker = cp.fork(WORKER_MODULE_PATH);

      worker.on('message', result => {
        const hasViolations = result.violations.length > 0;

        if (hasViolations) {
          console.log(getErrorOutput(result));
        } else {
          console.log(`${result.url} is okay`);
        }

        processNextHtmlFile(buildOptions, htmlFiles, workerPool, worker, done);
      });

      workerPool.push(worker);
    }

    for (const worker of workerPool) {
      processNextHtmlFile(buildOptions, htmlFiles, workerPool, worker, done);
    }
  };
}

module.exports = checkAccessibility;
