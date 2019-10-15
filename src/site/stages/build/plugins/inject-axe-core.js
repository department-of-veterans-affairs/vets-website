/* eslint-disable no-continue, no-param-reassign */

require('axe-core');

const path = require('path');
const ENVIRONMENTS = require('../../../constants/environments');

const axeSource = module.children.find(
  el => el.filename.indexOf('axe-core') !== -1,
).exports.source;

function injectAxeCore(buildOptions) {
  const shouldExecute =
    buildOptions.buildtype === ENVIRONMENTS.LOCALHOST || buildOptions.isPreview;

  if (!shouldExecute) {
    return () => {};
  }

  return (files, metalsmith, done) => {
    const axeCoreFileName = 'js/axe-core.js';
    files[axeCoreFileName] = {
      path: axeCoreFileName,
      contents: Buffer.from(axeSource),
    };

    for (const fileName of Object.keys(files)) {
      if (path.extname(fileName) !== '.html') continue;

      const file = files[fileName];
      const { dom } = file;

      const axeCoreScript = dom(
        `<script type="text/javascript" src="/${axeCoreFileName}"></script>`,
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
