/* eslint-disable no-console, no-await-in-loop */

const { JSDOM } = require('jsdom');
const { Script } = require('vm');

// eslint-disable-next-line no-unused-vars
const axeCore = require('axe-core');

const AXE_CONFIG = {
  iframes: false,
  runOnly: {
    type: 'tag',
    values: ['section508', 'wcag2a', 'wcag2aa'],
  },
};

const axeSource = module.children.find(
  el => el.filename.indexOf('axe-core') !== -1,
).exports.source;

const axeScript = new Script(`
  ${axeSource}
  axe.run(${JSON.stringify(AXE_CONFIG)}, window.axeCallback);
`);

function executeAxeCheck({ url, contents }) {
  let dom = new JSDOM(contents, {
    url,
    contentType: 'text/html',
    includeNodeLocations: false,
    runScripts: 'outside-only',
  });

  const operation = new Promise((resolve, reject) => {
    dom.window.axeCallback = (err, result) => {
      dom.window.close();
      dom = null;
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    };
  });

  dom.runVMScript(axeScript);

  return operation;
}

process.on('message', async file => {
  try {
    const result = await executeAxeCheck(file);
    process.send({ result });
  } catch (error) {
    console.log(error);
    process.send({ error: error.message });
  }
});
