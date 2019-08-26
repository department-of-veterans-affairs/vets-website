/* eslint-disable no-console */

const path = require('path');
const cp = require('child_process');

const _getErrorOutput = require('./getErrorOutput');

const WORKER_MODULE_PATH = path.join(__dirname, 'worker');

function _getWorker() {
  return cp.fork(WORKER_MODULE_PATH);
}

function _auditNextHtmlFile(buildOptions, htmlFiles, workerPool, worker, done) {
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
    contents: nextFile.contents,
  });
}

async function performAudit(
  buildOptions,
  htmlFiles,
  auditNextHtmlFile = _auditNextHtmlFile,
  getErrorOutput = _getErrorOutput,
  getWorker = _getWorker,
) {
  const numWorkers = 4;
  const workerPool = [];
  const results = {
    failures: [],
    incompletes: [],
    filesScanned: 0,
    totalFiles: htmlFiles.length,
  };

  const workerAudits = new Promise((resolve, reject) => {
    for (let i = 0; i < numWorkers; i++) {
      const worker = getWorker();

      worker.on('message', ({ error, result }) => {
        if (error) {
          reject(error);
          return;
        }

        results.filesScanned++;

        const isIncomplete = result.incomplete && result.incomplete.length > 0;
        const isFailure = result.violations && result.violations.length > 0;

        if (isIncomplete) {
          results.incompletes.push(result);
          console.log(`Incomplete results from ${result.url}`);
        } else if (isFailure) {
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

module.exports = performAudit;
module.exports.auditNextHtmlFile = _auditNextHtmlFile;
module.exports.getWorker = _getWorker;
