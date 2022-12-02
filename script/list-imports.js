/* eslint-disable no-console */
const fs = require('fs-extra');
const findImports = require('find-imports');
const commandLineArgs = require('command-line-args');

const getPackageName = importPath => {
  const parts = importPath.split('/');

  // Scoped NPM package
  if (importPath[0] === '@') {
    return parts.slice(0, 2).join('/');
  }

  return parts[0];
};

// These packages should be ignored
const ignoreList = ['@department-of-veterans-affairs/react-components'];

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
    { name: 'app-dir', type: String, defaultValue: 'platform' },
    { name: 'app-folder', type: String },
  ]);

  const appDir = options['app-dir'];
  const appFolderOpt = options['app-folder'];
  const appFolder = appFolderOpt ? `${appFolderOpt}/` : '';
  const fullPath = `src/${appDir}/${appFolder}**/*.*`;

  console.error = () => {};
  console.log('App path:', fullPath);
  console.log('Analyzing app imports...');
  const theImports = findImports(fullPath, {
    absoluteImports: false,
    relativeImports: false,
    packageImports: true,
    flatten: true,
  });

  const results = {
    dependencies: {},
    devDependencies: {},
    uninstalled: {},
  };

  theImports.forEach(importPath => {
    const packageName = getPackageName(importPath);

    // There are some packages we want to ignore
    if (ignoreList.includes(packageName)) return;

    if (deps[packageName]) {
      results.dependencies[packageName] = deps[packageName];
    }
    if (devDeps[packageName]) {
      results.devDependencies[packageName] = devDeps[packageName];
    }
    if (!devDeps[packageName] && !deps[packageName]) {
      results.uninstalled[packageName] = 'uninstalled';
    }
  });

  /* get all imports in a package */
  console.log(JSON.stringify(results, null, 2));
});
