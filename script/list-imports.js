/* eslint-disable no-console */
const fs = require('fs-extra');
const findImports = require('find-imports');
const commandLineArgs = require('command-line-args');

/* This script retrieves the depedency packages and, if available, the corresponding repo root level versioning */

/* Starts process: */
fs.readJSON('package.json', (err, data) => {
  /* attempts to read package.json */
  const deps = !err && data.dependencies ? data.dependencies : {};
  const devDeps = !err && data.devDependencies ? data.devDependencies : {};

  /* get CLI arguments
     set default directory to 'platform'
  */
  const options = commandLineArgs([
    { name: 'app-folder', type: String },
    { name: 'app-dir', type: String },
  ]);

  const appFolder = options['app-folder'];
  const appFolerImport = appFolder ? `${appFolder}/` : '';
  const appDir = options['app-dir'] || 'platform';

  console.error = () => {};
  console.log('Analyzing app imports...');
  const theImports = findImports(`src/${appDir}/${appFolerImport}**/*.*`, {
    absoluteImports: false,
    relativeImports: false,
    packageImports: true,
  });

  const results = {
    dependencies: {},
    devDependencies: {},
    uninstalled: {},
  };

  const keys = Object.keys(theImports);
  keys.forEach(key =>
    theImports[key].forEach(d => {
      if (deps[d]) {
        results.dependencies[d] = deps[d];
      }
      if (devDeps[d]) {
        results.devDependencies[d] = devDeps[d];
      }
      if (!devDeps[d] && !deps[d]) {
        results.uninstalled[d] = 'uninstalled';
      }
    }),
  );

  /* get all imports in a package */
  console.log(results);
});
