const { JSDOM } = require('jsdom');

const AXE_CONFIG = {
  iframes: false,
  runOnly: {
    type: 'tag',
    values: ['section508', 'wcag2a', 'wcag2aa'],
  },
};

function removeAxeFromModuleCache() {
  // Axe depends on global variables, and once imported,
  // those global variables are cached, so you can't simply
  // change the global values and then just re-execute axe.
  // To get around this, we remove axe from the module cache,
  // so that each require('axe-core') will do a fresh import of
  // the module.

  const axeModuleKey = require.resolve('axe-core');
  delete require.cache[axeModuleKey];
}

function executeAxeCheck({ url, contents }) {
  const dom = new JSDOM(contents, {
    url,
    contentType: 'text/html',
    includeNodeLocations: false,
  });

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
    axe.run(AXE_CONFIG, (err, result) => (err ? reject(err) : resolve(result)));
    removeAxeFromModuleCache();
  });
}

process.on('message', async file => {
  try {
    const result = await executeAxeCheck(file);
    process.send({ result });
  } catch (error) {
    process.send({ error });
  }
});
