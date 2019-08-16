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
    contents: nextFile.contents,
  });
}

module.exports = auditNextHtmlFile;
