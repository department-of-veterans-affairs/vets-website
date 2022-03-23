/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const glob = require('glob');
const { runCommand } = require('./utils');

const defaultPath = 'src/**/tests/**/*.pact.spec.js';

const options = commandLineArgs([
  // Comma-delimited string of relative paths
  {
    name: 'path',
    type: String,
    defaultOption: true,
    defaultValue: defaultPath,
  },
]);

if (options.path && options.path !== defaultPath) {
  const appPaths = options.path.split(',');

  const appGlobs = appPaths.reduce((globs, path) => {
    const appGlob = `${path}/**/tests/**/*.pact.spec.js`;
    return glob.sync(appGlob).length ? `${globs} ${appGlob}` : globs;
  }, '');

  if (!appGlobs) {
    console.log(`No contract tests found in the folder(s): ${options.path}.`);
    process.exit(0);
  }

  options.path = appGlobs;
}

runCommand(
  `BUILDTYPE=localhost npm run test:unit -- --reporter mochawesome --config config/mocha-pact.json ${
    options.path
  }`,
);
