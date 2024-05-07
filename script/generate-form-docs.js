const fs = require('fs');
const path = require('path');

const includePolyfillsAndLoaders = () => {
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
};

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

const generateFormDocs = application => {
  const appPath = path.resolve(application);
  const formJsPath = `${appPath}/config/form.js`;
  const structureJsonPath = `${appPath}/structure.json`;

  if (fs.existsSync(formJsPath)) {
    // eslint-disable-next-line import/no-dynamic-require
    const formConfig = require(formJsPath).default;

    const manifestContent = parseFormConfig(formConfig);

    fs.writeFileSync(
      structureJsonPath,
      JSON.stringify(manifestContent, null, 2),
    );
    process.stdout.write(`${structureJsonPath} has been written.`);
    return;
  }
  process.stdout.write(
    `${appPath} path does not exist, or does not contain a form.js`,
  );
};

if (process.argv.length < 3) {
  process.stdout.write('Usage: node generate-form-docs.js <applicationPath>');
  process.exit(1);
}

const applicationPath = process.argv[2];

includePolyfillsAndLoaders();
generateFormDocs(applicationPath);
