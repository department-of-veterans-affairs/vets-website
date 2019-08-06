const { JSDOM } = require('jsdom');

const axeCheckConfig = {
  iframes: false,
  runOnly: {
    type: 'tag',
    values: ['section508'],
  },
  rules: {
    'color-contrast': { enabled: false }
  }
};

function executeAxeCheck() {
  const axe = require('axe-core');
  return new Promise((resolve, reject) => {
    axe.run(axeCheckConfig, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function helper (html) {
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

  return executeAxeCheck();
}

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

process.on('message', async function(html) {
  const result = await helper(html);

  if (result.violations) {
    const output = getErrorOutput(result)
    process.send(output);
  } else {
    process.send('OK');
  }
});
