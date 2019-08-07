const path = require('path');
const cp = require('child_process');

const { WORKER_MESSAGE_TYPES } = require('./helpers/worker');
const WORKER_MODULE = path.join(__dirname, '/helpers/worker');

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

function checkAccessibility(buildOptions) {

  // if (buildOptions.watch) {
  //   // Too costly
  // }

  return async (files, metalsmith, done) => {

    console.log('Starting accessibility tests...');
    console.time('508');

    const htmlFiles = Object
      .keys(files)
      .filter(fileName => path.extname(fileName) === '.html')
      .map(fileName => files[fileName])
      .filter(file => !file.private)
      .slice(0, 100)
      .concat(files['index.html']);

    const totalWorkers = 5;
    const workers = new Array(5);

    const sliceSize = Math.round(htmlFiles.length / totalWorkers);

    for (let n = 0; n < totalWorkers; n++) {
      const startIndex = n * totalWorkers;
      const filesSlice = htmlFiles.slice(startIndex, startIndex + sliceSize);

      const fileData = filesSlice.map(file => {
        return {
          url: file.path,
          html: file.contents.toString(),
        };
      });

      const child = cp.fork(WORKER_MODULE);
      const operation = new Promise((resolve) => {
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

      child.send(fileData);
      workers[n] = operation;
    }

    try {
      const results = await Promise.all(workers);
      const flattened = results.reduce((all, slice) => all.concat(slice), []);

      // const output = results.map(getErrorOutput);
      // console.log(output)
      console.log('length ', flattened.length)
      console.timeEnd('508');
      done();
    } catch (err) {
      done(err);
    }
  };
}

module.exports = checkAccessibility;
