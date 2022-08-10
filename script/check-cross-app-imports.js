/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const omit = require('lodash/omit');
const findImports = require('find-imports');
const commandLineArgs = require('command-line-args');

const {
  buildGraph,
  dedupeGraph,
} = require('./github-actions/select-cypress-tests');

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

  Object.keys(importGraph).forEach(app => {
    const platformAppImports = getPlatformAppImports(platformImports, app);

    importGraph[app].platformFilesThatImportFromThisApp = platformAppImports;
  });

  if (!appFolders) return importGraph;

  const appImports = {};
  let crossAppImportsFound = false;
  for (const appFolder of appFolders) {
    if (importGraph[appFolder].appsToTest.length > 1) {
      // Multiple appsToTest means cross-app imports were found
      crossAppImportsFound = true;
    }
    appImports[appFolder] = omit(importGraph[appFolder], 'appsToTest');
  }

  return crossAppImportsFound ? appImports : null;
};

const options = commandLineArgs([
  { name: 'app-folders', type: String },
  { name: 'app-paths', type: String },
  { name: 'fail-on-cross-app-import', type: Boolean, defaultValue: false },
]);

let appFolders = null;
if (options['app-folders']) {
  appFolders = options['app-folders'].split(',');
} else if (options['app-paths']) {
  appFolders = options['app-paths']
    .split(',')
    .map(appPath => appPath.replace('src/applications/', ''));
}

// Generate full cross app import report when 'app-folders' option isn't used.
if (!appFolders) {
  const outputPath = path.join('./tmp', 'cross-app-imports.json');
  fs.outputFileSync(outputPath, JSON.stringify(getCrossAppImports(), null, 2));

  console.log(`Cross app import report saved at: ${outputPath}`);
  process.exit(0);
}

// Check that all provided apps exist
for (const appFolder of appFolders) {
  const appPath = path.join(__dirname, '../src/applications', appFolder);
  if (!fs.existsSync(appPath)) throw new Error(`${appPath} does not exist.`);
}

const crossAppImports = getCrossAppImports(appFolders);

if (crossAppImports) {
  console.log(JSON.stringify(crossAppImports, null, 2));

  if (options['fail-on-cross-app-import']) {
    throw new Error('Cross app imports found (see details above)');
  }
} else {
  console.log('No cross app imports were found!');
}
