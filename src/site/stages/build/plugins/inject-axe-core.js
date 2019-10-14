/* eslint-disable no-continue, no-param-reassign */

require('axe-core');

const path = require('path');
const ENVIRONMENTS = require('../../../constants/environments');

const axeSource = module.children.find(
  el => el.filename.indexOf('axe-core') !== -1,
).exports.source;

function executeAxeCheck() {
  // eslint-disable-next-line no-undef
  axe.run(
    'main',
    {
      iframes: false,
      runOnly: {
        type: 'tag',
        values: ['section508', 'wcag2a', 'wcag2aa', 'best-practice'],
        resultTypes: ['violations'],
      },
      rules: {
        'color-contrast': { enabled: false },
      },
    },
    (error, results) => {
      if (results.violations.length > 0) {
        const bannerEl = document.createElement('div');

        bannerEl.innerHTML = `
          <details class="vads-u-background-color--gold-lighter vads-u-padding--1">
            <summary>There are (${
              results.violations.length
            }) accessibility issues on this page.</summary>
            <ul class="usa-unstyled-list vads-u-padding-y--2 vads-u-padding-x--6">
              ${results.violations
                .map(violation => {
                  const {
                    description,
                    help,
                    helpUrl,
                    impact,
                    nodes,
                    tags,
                  } = violation;

                  return `
                  <li class="vads-u-margin-y--1">
                    <details>
                      <summary>${help}</summary>
                      <ul class="usa-unstyled-list vads-u-padding-y--1 vads-u-padding-x--2">
                        <li><strong>Description</strong>: ${description}</li>
                        <li><strong>Impact</strong>: ${impact}</li>
                        <li><strong>Tags</strong>: ${tags.join(', ')}</li>
                        <li><strong>Help</strong>: <a href="${helpUrl}" target="blank" rel="noopener noreferrer">${helpUrl}</a></li>
                        <li><strong>HTML</strong>:
                          <ol>
                            <li>
                              ${nodes
                                .map(node => {
                                  const code = document.createElement('code');
                                  code.innerText = node.html;
                                  return code.outerHTML;
                                })
                                .join('')}
                            </li>
                          </ol>
                        </li>
                      </ul>
                    </details>
                  </li>
                `;
                })
                .join('')}
            </ul>
          </details>
        </div>
      `;

        const header = document.querySelector('header');

        header.prepend(bannerEl, header.firstChild);
      }
    },
  );
}

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
        `<script>(${executeAxeCheck})();</script>`,
      );

      dom('body').append(axeCoreScript);
      dom('body').append(executeAxeCheckScript);
    }

    done();
  };
}

module.exports = injectAxeCore;
