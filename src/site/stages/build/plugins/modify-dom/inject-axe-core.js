/* eslint-disable no-continue, no-param-reassign */

require('axe-core');

const path = require('path');

const axeSource = module.children.find(
  el => el.filename.indexOf('axe-core') !== -1,
).exports.source;

const axeCoreFileName = 'js/axe-core.js';

module.exports = {
  initialize(buildOptions, files) {
    // Always write the Axe-Core script, so that the CMS Preview Server
    // has access to it in all environments.
    files[axeCoreFileName] = {
      path: axeCoreFileName,
      contents: Buffer.from(axeSource),
    };

    this.isEnabled = !!buildOptions.accessibility;
  },

  modifyFile(fileName, file) {
    if (!this.isEnabled) {
      return;
    }

    if (path.extname(fileName) !== '.html') return;

    const { dom } = file;

    const axeCoreScript = dom(
      `<script nonce="**CSP_NONCE**" type="text/javascript" src="/${axeCoreFileName}"></script>`,
    );

    const executeAxeCheckScript = dom(
      `<script nonce="**CSP_NONCE**" type="text/javascript" src="/js/execute-axe-check.js"></script>`,
    );

    dom('body').append(axeCoreScript);
    dom('body').append(executeAxeCheckScript);

    file.modified = true;
  },
};
