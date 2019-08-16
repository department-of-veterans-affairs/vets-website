/* eslint-disable no-console */

const path = require('path');
const cp = require('child_process');

const getErrorOutput = require('./getErrorOutput');
const auditNextHtmlFile = require('./auditNextHtmlFile');

const WORKER_MODULE_PATH = path.join(__dirname, 'worker');

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

module.exports = performAudit;
