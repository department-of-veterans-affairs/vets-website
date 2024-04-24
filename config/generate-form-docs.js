const fs = require('fs');
const path = require('path');

// Begin polyfill and loaders
process.env.BABEL_ENV = process.env.BABEL_ENV || 'test';
require('@babel/register');
require('babel-polyfill');

const ENVIRONMENTS = require('../src/site/constants/environments');

global.__BUILDTYPE__ = process.env.BUILDTYPE || ENVIRONMENTS.VAGOVDEV;
global.__API__ = null;
global.__MEGAMENU_CONFIG__ = null;
global.__REGISTRY__ = [];
global.location = {
  pathname: '',
};
global.navigator = {};
global.document = {
  querySelector: () => {},
  getElementById: () => {},
};
global.window = {
  addEventListener: () => {},
};
global.localStorage = {
  getItem: () => {},
};
// End polyfill and loaders

const extractReturnStatement = funcStr => {
  const regex = /return.*?;/;
  const match = funcStr.match(regex);
  return match ? match[0] : null;
};

// eslint-disable-next-line no-unused-vars
const formConfigToMarkdown = formConfig =>
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
${page.depends?.name ? `\nDepends: ${page.depends.name}\n` : ''}`,
        )
        .join('\n')}`,
    )
    .join('\n');

const parseFormConfig = formConfig =>
  Object.values(formConfig.chapters).map(chapter => ({
    title: chapter.title,
    pages: Object.values(chapter.pages).map(page => ({
      title:
        page.title === 'function'
          ? page.title({
              fullName: {
                first: 'Firstname',
                last: 'Lastname',
              },
            })
          : page.title,
      path: page.path,
      depends:
        page.depends?.name !== 'depends'
          ? page.depends?.name
          : extractReturnStatement(page.depends?.toString()),
    })),
  }));

class GenerateFormDocs {
  constructor(apps) {
    this.apps = apps;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'GenerateJsonPlugin',
      (compilation, callback) => {
        if (compilation.getStats().compilation.errors.length > 0) {
          callback();
        }

        for (const entry of Object.values(this.apps)) {
          const appPath = path.dirname(entry);
          const formJsPath = `${appPath}/config/form.js`;
          const manifestJsonPath = `${appPath}/manifest.json`;

          if (fs.existsSync(formJsPath) && fs.existsSync(manifestJsonPath)) {
            // eslint-disable-next-line import/no-dynamic-require
            const formConfig = require(formJsPath).default;

            // eslint-disable-next-line import/no-dynamic-require
            const manifestContent = require(manifestJsonPath);

            manifestContent.formConfig = parseFormConfig(formConfig);

            fs.writeFileSync(
              manifestJsonPath,
              JSON.stringify(manifestContent, null, 2),
            );
          }
        }

        callback();
      },
    );
  }
}

module.exports = GenerateFormDocs;
