/* eslint-disable no-console, no-await-in-loop */

const path = require('path');
const cp = require('child_process');

const ENVIRONMENTS = require('../../../../constants/environments');

const getErrorOutput = require('./helpers/getErrorOutput');

const WORKER_MODULE_PATH = path.join(__dirname, '/helpers/worker');

function getHtmlFileList(files) {
  return Object.keys(files)
    .filter(fileName => path.extname(fileName) === '.html')
    .map(fileName => files[fileName])
    .filter(file => !file.private);
}

function auditNextHtmlFile(buildOptions, htmlFiles, workerPool, worker, done) {
  if (htmlFiles.length === 0) {
    const workerIndex = workerPool.indexOf(worker);
    workerPool.splice(workerIndex, 1);
    worker.kill();

    if (workerPool.length === 0) {
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

async function performAudit(buildOptions, htmlFiles) {
  const numWorkers = 4;
  const workerPool = [];
  const results = {
    failures: [],
    filesScanned: 0,
    totalFiles: htmlFiles.length,
  };

  const workerAudits = new Promise((resolve, reject) => {
    for (let i = 0; i < numWorkers; i++) {
      const worker = cp.fork(WORKER_MODULE_PATH);

      worker.on('message', ({ error, result }) => {
        if (error) {
          reject(error);
          return;
        }

        results.filesScanned++;

        const hasViolations = result.violations.length > 0;
        if (hasViolations) {
          results.failures.push(result);
          console.log(getErrorOutput(result));
        } else {
          console.log(`${result.url} is okay`);
        }

        auditNextHtmlFile(buildOptions, htmlFiles, workerPool, worker, resolve);
      });

      workerPool.push(worker);
    }

    for (const worker of workerPool) {
      auditNextHtmlFile(buildOptions, htmlFiles, workerPool, worker, resolve);
    }
  });

  await workerAudits;
  return results;
}

function checkAccessibility(buildOptions) {
  const shouldExecute = buildOptions.accessibility;

  if (!shouldExecute) {
    const noop = () => {};
    return noop;
  }

  const environmentsThatMustPass = new Set([
    ENVIRONMENTS.VAGOVSTAGING,
    ENVIRONMENTS.VAGOVPROD,
  ]);

  const buildMustPass = environmentsThatMustPass.has(buildOptions.buildtype);

  return async (files, metalsmith, done) => {
    console.log('Starting accessibility tests...');
    console.time('Accessibility');

    const htmlFiles = getHtmlFileList(files);

    try {
      const results = await performAudit(buildOptions, htmlFiles);

      console.timeEnd('Accessibility');

      let summary = `Scanned ${results.filesScanned} of ${
        results.totalFiles
      } files with ${results.failures.length} files failing`;

      const hasFailures = results.failures.length > 0;

      if (hasFailures) {
        const pages = results.failures.map(result => result.url).join('\n');
        summary = `${summary}: \n${pages}`;

        if (buildMustPass) {
          done(summary);
          return;
        }
      }

      console.log(summary);
      done();
    } catch (err) {
      done(err.message);
    }
  };
}

module.exports = checkAccessibility;
