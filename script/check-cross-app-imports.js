/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const omit = require('lodash/omit');
const pickBy = require('lodash/pickBy');
const findImports = require('find-imports');
const commandLineArgs = require('command-line-args');
const core = require('@actions/core');

const {
  buildGraph,
  dedupeGraph,
} = require('./github-actions/select-cypress-tests');

const changedAppsConfig = require('../config/changed-apps-build.json');

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
 * Determine whether app has cross-app imports in the import graph
 *
 * @param {string} importGraph - Cross app import dependency graph.
 * @param {string} appFolder - The name of an app's folder in 'src/applications'.
 * @returns {boolean} - True if app has cross-app imports in graph.
 */
const appHasCrossAppImports = (importGraph, appFolder) => {
  return (
    Object.keys(importGraph[appFolder].appsThatThisAppImportsFrom).length ||
    Object.keys(importGraph[appFolder].appsThatImportFromThisApp).length
  );
};

/**
 * Generates a cross app import graph.
 *
 * @param {string[]} appFolders - Array of app folders in 'src/applications'.
 * @returns {Object|null} Cross app import dependency graph.
 */
const getCrossAppImports = appFolders => {
  // Suppress errors from 'find-imports' when building graph.
  console.error = () => {};
  console.log('Analyzing app imports...');

  const importGraph = dedupeGraph(buildGraph());
  const platformImports = findImports('src/platform/**/*.*', {
    absoluteImports: true,
    relativeImports: true,
    packageImports: false,
  });

  // Zero out references from src/platform so that they won't flag isolation checks.
  // This approach preserves data in case you want to log or debug it,
  // but ensures it doesn't affect the cross-app import logic.
  Object.keys(importGraph).forEach(app => {
    importGraph[app].platformFilesThatImportFromThisApp = [];
  });

  Object.keys(importGraph).forEach(app => {
    const platformAppImports = getPlatformAppImports(platformImports, app);

    importGraph[app].platformFilesThatImportFromThisApp = platformAppImports;
  });

  if (!appFolders) return importGraph;

  const appImports = {};
  let crossAppImportsFound = false;
  for (const appFolder of appFolders) {
    if (appHasCrossAppImports(importGraph, appFolder)) {
      crossAppImportsFound = true;
    }
    appImports[appFolder] = omit(importGraph[appFolder], 'appsToTest');
  }

  return crossAppImportsFound ? appImports : null;
};

const options = commandLineArgs([
  { name: 'app-folders', type: String },
  { name: 'check-allowlist', type: Boolean, defaultValue: false },
  { name: 'fail-on-cross-app-import', type: Boolean, defaultValue: false },
]);

let appFolders = options['app-folders'] && options['app-folders'].split(',');
const checkAllowlist = options['check-allowlist'];
const failOnCrossAppImport = options['fail-on-cross-app-import'];

// Generate full cross app import report when no apps are specified
if (!appFolders && !checkAllowlist) {
  const outputPath = path.join('./tmp', 'cross-app-imports.json');
  const crossAppJson = getCrossAppImports();
  fs.outputFileSync(outputPath, JSON.stringify(crossAppJson, null, 2));
  core.exportVariable(
    'APPS_NOT_ISOLATED',
    JSON.stringify(
      Object.keys(crossAppJson).filter(app => {
        const appData = crossAppJson[app];
        return (
          appData.appsThatThisAppImportsFrom &&
          Object.keys(appData.appsThatThisAppImportsFrom).length > 0
        );
      }),
    ),
  );
  console.log(`Cross app import report saved at: ${outputPath}`);
  process.exit(0);
}

// Check all apps on the allowlist when this option is specified
if (checkAllowlist) {
  appFolders = changedAppsConfig.apps.map(app => app.rootFolder);
}

// Check that all provided apps exist
for (const appFolder of appFolders) {
  const appPath = path.join(__dirname, '../src/applications', appFolder);
  if (!fs.existsSync(appPath)) throw new Error(`${appPath} does not exist.`);
}

const crossAppImports = getCrossAppImports(appFolders);
if (crossAppImports && failOnCrossAppImport) {
  // For clarity, only show apps that have cross app imports
  const checkApp = (appObj, app) => appHasCrossAppImports(crossAppImports, app);
  const filteredImports = pickBy(crossAppImports, checkApp);
  console.log('Cross app imports found:');
  console.log(JSON.stringify(filteredImports, null, 2));
  process.exit(1);
} else if (crossAppImports) {
  console.log(JSON.stringify(crossAppImports, null, 2));
} else {
  console.log('No cross app imports were found!');
}
