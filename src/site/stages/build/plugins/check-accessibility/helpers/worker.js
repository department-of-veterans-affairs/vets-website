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
  const dom = new JSDOM(contents, {
    url,
    contentType: 'text/html',
    includeNodeLocations: false,
    runScripts: 'outside-only',
  });

  const operation = new Promise((resolve, reject) => {
    dom.window.axeCallback = (err, result) => {
      dom.window.close();
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

const maxMemory = 50000000;
const sleep = (snooze = 2000) =>
  new Promise(resolve => setTimeout(resolve, snooze));

process.on('message', async file => {
  try {
    const result = await executeAxeCheck(file);

    while (process.memoryUsage().heapUsed > maxMemory) {
      console.log('snoozing....');
      const heapUsed = process.memoryUsage().heapUsed;
      await sleep();
      console.log(
        `Heap changed by ${process.memoryUsage().heapUsed - heapUsed}`,
      );
    }

    process.send({ result });
  } catch (error) {
    console.log(error);
    process.send({ error: error.message });
  }
});
