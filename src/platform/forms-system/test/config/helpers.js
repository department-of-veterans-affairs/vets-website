import { mount } from 'enzyme';

// Helper to get a fresh axe-core instance.
// In jsdom 16+, axe-core captures window/document references at module load time.
// Since mocha-setup creates a new JSDOM for each test (in beforeEach), the cached
// axe-core module may have stale references. Re-requiring fixes this.
function getFreshAxe() {
  const axeCachePath = require.resolve('axe-core');
  delete require.cache[axeCachePath];
  return require('axe-core');
}

export function axeCheck(component) {
  const axe = getFreshAxe();

  if (axe._tree) {
    axe.teardown();
  }

  let div = document.getElementById('axeContainer');
  if (!div) {
    div = document.createElement('div');
    div.setAttribute('id', 'axeContainer');
    document.body.appendChild(div);
  }
  div.innerHTML = '';

  mount(component, { attachTo: div });

  return new Promise((resolve, reject) => {
    axe.run(document.body, (err, result) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        reject(err);
      }
      if (result.violations.length) {
        reject(
          new Error(
            result.violations
              .map(violation => {
                const nodeInfo = violation.nodes.reduce((str, node) => {
                  const { html, target } = node;
                  return [str, html, ...target].join('\n');
                }, '');

                return `[${violation.impact}] ${violation.help}
            See ${violation.helpUrl}
            ${nodeInfo}`;
              })
              .join('\n'),
          ),
        );
      }

      resolve();
    });
  });
}

export const uploadStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: true,
      },
    },
    featureToggles: {
      // eslint-disable-next-line camelcase
      file_upload_short_workflow_enabled: true,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};
