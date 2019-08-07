const path = require('path');
const cp = require('child_process');

const { WORKER_MESSAGE_TYPES } = require('./helpers/worker');

const WORKER_MODULE_PATH = path.join(__dirname, '/helpers/worker');

function getErrorOutput(result) {
  const formattedViolations = result.violations.map(violation => {
    let output = `[${violation.impact}] ${violation.help}`;

    output += `See ${violation.helpUrl}`;
    output += violation.nodes.reduce((str, node) => {
      const { html, target } = node;
      return [str, html, ...target].join('\n');
    }, '');

    return output;
  });

  return formattedViolations;
}

function getHtmlFileList(files) {
  return Object.keys(files)
    .filter(fileName => path.extname(fileName) === '.html')
    .map(fileName => files[fileName])
    .filter(file => !file.private)
    .slice(0, 100)
    .concat(files['index.html']);
}

function getPartition(htmlFiles, index, partitionSize) {
  const startIndex = index * partitionSize;
  const endIndex = startIndex + partitionSize;

  return htmlFiles.slice(startIndex, endIndex).map(file => ({
    url: `/${file.path}`,
    html: file.contents.toString(),
  }));
}

function beginChildProcess(child, partition) {
  const operation = new Promise(resolve => {
    child.on('message', message => {
      switch (message.type) {
        case WORKER_MESSAGE_TYPES.PROGRESS:
          console.log(`Done with ${message.url}`);
          break;
        case WORKER_MESSAGE_TYPES.DONE:
          resolve(message.result);
          child.kill();
      }
    });
  });

  child.send(partition);
  return operation;
}

function checkAccessibility(buildOptions) {
  return async (files, metalsmith, done) => {
    console.log('Starting accessibility tests...');
    console.time('Accessibility');

    const htmlFiles = getHtmlFileList(files);
    const totalWorkers = 10;
    const partitionSize = Math.ceil(htmlFiles.length / totalWorkers);
    const workers = [];

    for (let index = 0; index < totalWorkers; index++) {
      const child = cp.fork(WORKER_MODULE_PATH);
      const partition = getPartition(htmlFiles, index, partitionSize);
      const operation = beginChildProcess(child, partition);

      workers.push(operation);
    }

    try {
      const results = await Promise.all(workers);
      const flattened = results.reduce((all, slice) => all.concat(slice), []);

      // const output = results.map(getErrorOutput);
      // console.log(output)
      console.timeEnd('Accessibility');
      console.log(
        `Processed ${flattened.length} out of ${htmlFiles.length} files`,
      );
      done();
    } catch (err) {
      done(err);
    }
  };
}

module.exports = checkAccessibility;
