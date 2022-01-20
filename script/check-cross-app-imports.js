/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const omit = require('lodash/omit');
const findImports = require('find-imports');
const commandLineArgs = require('command-line-args');

const {
  buildGraph,
  dedupeGraph,
} = require('./github-actions/select-cypress-tests.js');

/**
 * Gets the paths of files in 'src/platform' that import from apps.
 *
 * @param {string} platformImports - Platform imports generated from 'find-imports'.
 * @param {string} appFolder - The name of an app's folder in 'src/applications'.
 * @returns {string[]} An array of platform file paths that import from the given app folder.
 */
const getPlatformAppImports = (platformImports, appFolder) => {
  return Object.keys(platformImports).filter(file =>
    platformImports[file].some(importPath =>
      importPath.includes(`applications/${appFolder}`),
    ),
  );
};

/**
 * Generates a cross app import graph.
 *
 * @param {string} appFolder - The name of an app's folder in 'src/applications'.
 * @returns {Object|null} Cross app import dependency graph.
 */
const getCrossAppImports = appFolder => {
  // Suppress errors from 'find-imports' when building graph.
  console.error = () => {};
  console.log('Analyzing app imports...');

  const importGraph = dedupeGraph(buildGraph());
  const platformImports = findImports('src/platform/**/*.*', {
    absoluteImports: true,
    relativeImports: true,
    packageImports: false,
  });

  Object.keys(importGraph).forEach(app => {
    const platformAppImports = getPlatformAppImports(platformImports, app);

    importGraph[app].platformFilesThatImportFromThisApp = platformAppImports;
  });

  if (!appFolder) return importGraph;

  const appImports = importGraph[appFolder];

  // There should only be 1 app to test when no cross app imports are found.
  if (appImports.appsToTest.length === 1) return null;

  return omit(appImports, 'appsToTest');
};

const options = commandLineArgs([{ name: 'app-folder', type: String }]);

const appFolder = options['app-folder'];

// Generate full cross app import report when 'app-folder' option isn't used.
if (!appFolder) {
  const outputPath = path.join('./tmp', 'cross-app-imports.json');
  fs.outputFileSync(outputPath, JSON.stringify(getCrossAppImports(), null, 2));

  console.log(`Cross app import report saved at: ${outputPath}`);
  process.exit(0);
}

const appPath = path.join(__dirname, '../src/applications', appFolder);
if (!fs.existsSync(appPath)) throw new Error(`${appPath} does not exist.`);

const crossAppImports = getCrossAppImports(appFolder);

if (!crossAppImports) {
  console.log('No cross app imports were found!');
  process.exit(0);
}

console.log(JSON.stringify(crossAppImports, null, 2));
