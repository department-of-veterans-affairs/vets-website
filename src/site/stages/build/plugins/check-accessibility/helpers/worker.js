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
  rules: {
    'color-contrast': { enabled: false }
  }
};

function executeAxeCheck(html) {
  const dom = new JSDOM(html);

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
  const result = [];

  for (const file of fileList) {
    result.push(await executeAxeCheck(file.html));
    process.send({
      type: WORKER_MESSAGE_TYPES.PROGRESS,
      url: file.url,
    });
  }

  process.send({
    type: WORKER_MESSAGE_TYPES.DONE,
    result,
  });
});

module.exports.WORKER_MESSAGE_TYPES = WORKER_MESSAGE_TYPES;
