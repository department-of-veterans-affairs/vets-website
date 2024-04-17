// Start - polyfills and bootstrap

process.env.BABEL_ENV = process.env.BABEL_ENV || 'test';
require('@babel/register');
require('babel-polyfill');
const ENVIRONMENTS = require('../src/site/constants/environments');

global.__BUILDTYPE__ = process.env.BUILDTYPE || ENVIRONMENTS.VAGOVDEV;
global.__API__ = null;
global.__MEGAMENU_CONFIG__ = null;
global.__REGISTRY__ = [];
global.location = {};
global.navigator = {};
global.document = {
  querySelector: () => {},
};
global.window = {
  addEventListener: () => {},
};

// End - polyfills and bootstrap

const formConfig = require('../src/applications/pensions/config/form').default;

// eslint-disable-next-line no-console
console.log(
  Object.values(formConfig.chapters)
    .map(
      chapter => `# ${chapter.title}
${Object.values(chapter.pages)
        .map(
          page => `## ${
            typeof page.title === 'function'
              ? page.title({
                  fullName: {
                    first: 'Firstname',
                    last: 'Lastname',
                  },
                })
              : page.title
          }
Path: ${page.path}
${page.depends?.name ? `Depends: ${page.depends.name}\n` : ''}`,
        )
        .join('\n')}`,
    )
    .join('\n'),
);
