const fs = require('fs');
const path = require('path');

/**
 * Includes polyfills and runtime loaders into the current executing context
 * This is required because we are running browser code in node and need
 * to have access to features that do not exist in the current runtime
 */
const includePolyfillsAndLoaders = () => {
  // Babel loaders
  process.env.BABEL_ENV = process.env.BABEL_ENV || 'test';
  require('@babel/register');
  require('babel-polyfill');

  const ENVIRONMENTS = require('../src/site/constants/environments');

  global.__BUILDTYPE__ = process.env.BUILDTYPE || ENVIRONMENTS.VAGOVDEV;
  global.__API__ = null;
  global.__MEGAMENU_CONFIG__ = null;
  global.__REGISTRY__ = [];
  // Browser shims
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

/**
 * Extract a return statement from a function string body
 * @param funcStr
 * @returns {*|null}
 */
const extractReturnStatement = funcStr => {
  const regex = /return.*?;/;
  const match = funcStr.match(regex);
  return match ? match[0] : null;
};

/**
 * Converts a parsed form config to a markdown readable format
 * @param formConfig
 * @returns {string}
 */
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

/**
 * Parses a form config and returns the essential data points.
 * @param formConfig
 * @returns {{pages: {path: *, depends: *|null, title: *}[], title: *}[]}
 */
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

/**
 * Generate form config documentation for a given application name.
 * @param application
 */
const generateFormDocs = application => {
  const appPath = path.resolve(application);
  const formJsPath = `${appPath}/config/form.js`;
  const structureJsonPath = `${appPath}/structure.json`;

  if (!fs.existsSync(formJsPath)) {
    process.stderr.write(
      `${appPath} does not contain a config/form.js file.\n`,
    );
    return;
  }

  // eslint-disable-next-line import/no-dynamic-require
  const formConfig = require(formJsPath).default;

  const structureContent = parseFormConfig(formConfig);

  fs.writeFileSync(
    structureJsonPath,
    `${JSON.stringify(structureContent, null, 2)}\n`,
  );
  process.stdout.write(`${structureJsonPath} has been written.\n`);
};

/**
 * Constructs the application path based on the application name.
 * @param applicationName The name of the application.
 * @returns The constructed application path.
 */
const constructApplicationPath = applicationName =>
  path.resolve(__dirname, `../src/applications/${applicationName}`);

/**
 * Processes the list of application paths.
 * @param applicationPaths The list of application paths.
 * @returns The processed list of application paths.
 */
const processApplicationsInput = applicationPaths =>
  applicationPaths.map(applicationPath =>
    constructApplicationPath(applicationPath.trim()),
  );

if (process.argv.length < 3) {
  process.stdout.write(
    `Usage: node ${__filename} <applicationName1(,applicationNameN)>
Example: node ${__filename} pensions, burials\n`,
  );
  process.exit(1);
}

const applicationInput = process.argv
  .slice(2)
  .join('')
  .split(',')
  .map(arg => arg.trim());

const applicationPaths = processApplicationsInput(applicationInput);

includePolyfillsAndLoaders();
applicationPaths.forEach(applicationPath => generateFormDocs(applicationPath));
