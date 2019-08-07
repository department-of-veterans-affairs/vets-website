const { JSDOM } = require('jsdom');

const WORKER_MESSAGE_TYPES = {
  DONE: 'DONE',
  PROGRESS: 'PROGRESS',
};

const AXE_CONFIG = {
  iframes: false,
  runOnly: {
    type: 'tag',
    values: ['section508', 'wcag2a', 'wcag2aa'],
  },
};

function executeAxeCheck(file) {
  const dom = new JSDOM(file.html);

  global.document = dom;
  global.window = dom.window;

  // needed by axios lib/helpers/isURLSameOrigin.js
  global.navigator = window.navigator;

  // needed by axe /lib/core/public/run.js
  global.Node = window.Node;
  global.NodeList = window.NodeList;

  // needed by axe /lib/core/base/context.js
  global.Element = window.Element;
  global.Document = window.Document;

  const axe = require('axe-core');

  return new Promise((resolve, reject) => {
    axe.run(AXE_CONFIG, (err, result) => err ? reject(err) : resolve(result));
  });
}

process.on('message', async function(fileList) {
  const allResults = [];

  for (const file of fileList) {
    const result = await executeAxeCheck(file);

    result.url = file.url;
    allResults.push(result);

    process.send({
      type: WORKER_MESSAGE_TYPES.PROGRESS,
      result,
    });
  }

  process.send({
    type: WORKER_MESSAGE_TYPES.DONE,
    result: allResults,
  });
});

module.exports.WORKER_MESSAGE_TYPES = WORKER_MESSAGE_TYPES;
