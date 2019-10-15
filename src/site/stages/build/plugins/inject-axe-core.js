/* eslint-disable no-continue, no-param-reassign */

require('axe-core');

const path = require('path');

const axeSource = module.children.find(
  el => el.filename.indexOf('axe-core') !== -1,
).exports.source;

function injectAxeCore(buildOptions) {
  const isEnabled = !!buildOptions.accessibility;

  if (!isEnabled) {
    return () => {};
  }

  return (files, metalsmith, done) => {
    for (const fileName of Object.keys(files)) {
      if (path.extname(fileName) !== '.html') continue;

      const file = files[fileName];
      const { dom } = file;

      const axeCoreScript = dom(
        `<script type="text/javascript">${axeSource}</script>`,
      );

      const executeAxeCheckScript = dom(
        `<script type="text/javascript" src="/js/execute-axe-check.js"></script>`,
      );

      dom('body').append(axeCoreScript);
      dom('body').append(executeAxeCheckScript);
    }

    done();
  };
}

module.exports = injectAxeCore;
