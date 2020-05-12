/* eslint-disable no-continue, no-param-reassign */

require('axe-core');

const path = require('path');

const axeSource = module.children.find(
  el => el.filename.indexOf('axe-core') !== -1,
).exports.source;

function injectAxeCore(buildOptions) {
  return (files, metalsmith, done) => {
    // Always write the Axe-Core script, so that the CMS Preview Server
    // has access to it in all environments.
    const axeCoreFileName = 'js/axe-core.js';
    files[axeCoreFileName] = {
      path: axeCoreFileName,
      contents: Buffer.from(axeSource),
    };

    const isEnabled = !!buildOptions.accessibility;

    if (!isEnabled) {
      done();
      return;
    }

    for (const fileName of Object.keys(files)) {
      if (path.extname(fileName) !== '.html') continue;

      const file = files[fileName];
      const { dom } = file;

      const axeCoreScript = dom(
        `<script type="text/javascript" src="/${axeCoreFileName}"></script>`,
      );

      const executeAxeCheckScript = dom(
        `<script type="text/javascript" src="/generated/execute-axe-check.js"></script>`,
      );

      dom('body').append(axeCoreScript);
      dom('body').append(executeAxeCheckScript);

      file.modified = true;
    }

    done();
  };
}

module.exports = injectAxeCore;
