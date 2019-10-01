/* eslint-disable no-continue */

require('axe-core');

const path = require('path');

const axeSource = module.children.find(
  el => el.filename.indexOf('axe-core') !== -1,
).exports.source;

function injectAxeCore() {
  return (files, metalsmith, done) => {
    for (const fileName of Object.keys(files)) {
      if (path.extname(fileName) !== '.html') continue;

      const file = files[fileName];
      const { dom } = file;

      const axeCoreScript = dom(`<script>${axeSource}</script>`);
      const executeAxeCheckScript = dom(`
        <script>
          axe.run(document, {
            iframes: false,
            runOnly: {
              type: 'tag',
              values: ['section508', 'wcag2a', 'wcag2aa', 'best-practices'],
              resultTypes: ['violations'],
            },
            rules: {
              'color-contrast': { enabled: false },
            },
          }, function axeCheckDone(error, results) {
            console.log(results);
          });
        </script>
      `);

      dom('body').append(axeCoreScript);
      dom('body').append(executeAxeCheckScript);
    }

    done();
  };
}

module.exports = injectAxeCore;
