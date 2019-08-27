/* eslint-disable no-console */

const path = require('path');
const chalk = require('chalk');
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

/**
 * Executes the axe-check on an array of HTML files by creating a pool
 * of child processes where each child process grabs the next HTML file as they
 * finish scanning their current HTML file.
 */
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

      // Set up the parent-child process message handler,
      // where "result" is the result of a single page audit.
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
          console.log(
            chalk.yellow(
              `${result.url}: Scan could not be completed on nodes:`,
            ),
          );
          console.log(chalk.yellow(result.incomplete));
        } else if (isFailure) {
          results.failures.push(result);
          console.log(chalk.red(getErrorOutput(result)));
        } else {
          console.log(chalk.cyan(`${result.url}: Passes`));
        }

        auditNextHtmlFile(buildOptions, htmlFiles, workerPool, worker, resolve);
      });

      workerPool.push(worker);
    }

    // Kick off the child processes
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
