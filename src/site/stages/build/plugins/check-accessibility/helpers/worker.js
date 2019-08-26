/* eslint-disable no-console, no-await-in-loop */

const { JSDOM } = require('jsdom');
const { Script } = require('vm');

// eslint-disable-next-line no-unused-vars
const axeCore = require('axe-core');

const axeSource = module.children.find(
  el => el.filename.indexOf('axe-core') !== -1,
).exports.source;

const axeScript = new Script(axeSource);
const runAxeScript = new Script(`
  axe.run({
    iframes: false,
    runOnly: {
      type: 'tag',
      values: ['section508', 'wcag2a', 'wcag2aa'],
    },
    rules: {
      'color-contrast': { enabled: false },
    },
  }, window.axeCallback);
`);

function executeAxeCheck({ url, contents }) {
  return new Promise((resolve, reject) => {
    let dom = new JSDOM(Buffer.from(contents), {
      url,
      includeNodeLocations: false,
      runScripts: 'outside-only',
    });

    dom.window.axeCallback = (err, result) => {
      dom.window.close();
      dom = null;
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    };

    dom.runVMScript(axeScript);
    dom.runVMScript(runAxeScript);
  });
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

module.exports = executeAxeCheck;
