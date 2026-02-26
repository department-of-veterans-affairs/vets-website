/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

const fs = require('fs-extra');
const path = require('path');
const omit = require('lodash/omit');
const pickBy = require('lodash/pickBy');
const commandLineArgs = require('command-line-args');
const core = require('@actions/core');
const glob = require('glob');
const { promisify } = require('util');

const globAsync = promisify(glob);

/**
 * Fast regex-based import extraction.
 * Extracts import/require statements from file content.
 */
function extractImportsFromContent(content) {
  const imports = [];

  // Remove single-line comments to avoid matching commented imports
  const contentWithoutComments = content.replace(/\/\/.*$/gm, '');

  // Match ES6 imports: import ... from 'path' or import 'path'
  const es6ImportRegex = /import\s+(?:(?:[\w*{}\s,]+)\s+from\s+)?['"]([^'"]+)['"]/g;
  for (const match of contentWithoutComments.matchAll(es6ImportRegex)) {
    imports.push(match[1]);
  }

  // Match dynamic imports: import('path')
  const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  for (const match of contentWithoutComments.matchAll(dynamicImportRegex)) {
    imports.push(match[1]);
  }

  // Match require statements: require('path')
  const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  for (const match of contentWithoutComments.matchAll(requireRegex)) {
    imports.push(match[1]);
  }

  // Filter to only relative and absolute imports (not packages)
  return imports.filter(
    imp => imp.startsWith('.') || imp.startsWith('applications/'),
  );
}

/**
 * Fast parallel import scanning using glob + regex.
 * Much faster than find-imports for large codebases.
 */
async function getImportsFast(globPattern, ignorePatterns = []) {
  // Convert to JS/TS specific patterns
  const pattern = Array.isArray(globPattern) ? globPattern[0] : globPattern;
  const jsPattern = pattern.replace('**/*.*', '**/*.{js,jsx,ts,tsx,mjs}');

  const ignoreList = ['**/node_modules/**', ...ignorePatterns];
  const files = await globAsync(jsPattern, {
    ignore: ignoreList,
  });

  // Process all files in parallel
  const fileResults = await Promise.all(
    files.map(async filePath => {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const imports = extractImportsFromContent(content);
        return { filePath, imports };
      } catch {
        return { filePath, imports: [] };
      }
    }),
  );

  const results = {};
  for (const { filePath, imports } of fileResults) {
    if (imports.length > 0) {
      results[filePath] = imports;
    }
  }

  return results;
}

function getAppNameFromFilePath(filePath) {
  return filePath.split('/')[2];
}

/* Function takes an import reference and returns the path
 * to the referenced file from 'src/' if the reference begins
 * with 'applications/' or starts with '../'. Otherwise
 * it returns the given reference.
 */
function getImportPath(filePathAsArray, importRef) {
  if (importRef.startsWith('applications/')) {
    return `src/${importRef}`;
  }
  if (importRef.startsWith('../')) {
    const numDirsUp = importRef.split('/').filter(str => str === '..').length;

    return importRef.replace(
      '../'.repeat(numDirsUp),
      `${filePathAsArray
        .slice(0, filePathAsArray.length - 1 - numDirsUp)
        .join('/')}/`,
    );
  }

  return importRef;
}

function importIsFromOtherApplication(appName, importPath) {
  return (
    importPath.startsWith('src/applications') &&
    !importPath.startsWith(`src/applications/${appName}`)
  );
}

function updateGraph(graph, appName, importerFilePath, importeeFilePath) {
  const importAppName = getAppNameFromFilePath(importeeFilePath);

  if (!graph[importAppName]) {
    graph[importAppName] = {
      appsToTest: [importAppName],
      appsThatThisAppImportsFrom: {},
      appsThatImportFromThisApp: {},
    };
  }

  if (!graph[appName].appsThatThisAppImportsFrom[importAppName]) {
    graph[appName].appsThatThisAppImportsFrom[importAppName] = {
      filesImported: [],
    };
  }

  graph[appName].appsThatThisAppImportsFrom[importAppName].filesImported.push({
    importer: importerFilePath,
    importee: importeeFilePath,
  });

  if (!graph[importAppName].appsThatImportFromThisApp[appName]) {
    graph[importAppName].appsThatImportFromThisApp[appName] = {
      filesImported: [],
    };
  }

  graph[importAppName].appsThatImportFromThisApp[appName].filesImported.push({
    importer: importerFilePath,
    importee: importeeFilePath,
  });
}

async function buildGraph() {
  const graph = {};
  const globPattern = 'src/applications/**/*.*';
  const ignorePatterns = ['src/applications/*.*']; // Ignore files directly in applications folder
  const imports = await getImportsFast(globPattern, ignorePatterns);

  const importerFiles = Object.keys(imports);
  importerFiles.forEach(importerFilePath => {
    const appName = getAppNameFromFilePath(importerFilePath);
    const filePathAsArray = importerFilePath.split('/');

    if (!graph[appName]) {
      graph[appName] = {
        appsToTest: [appName],
        appsThatThisAppImportsFrom: {},
        appsThatImportFromThisApp: {},
      };
    }

    imports[importerFilePath].forEach(importRef => {
      const importeeFilePath = getImportPath(filePathAsArray, importRef);

      if (importIsFromOtherApplication(appName, importeeFilePath)) {
        updateGraph(graph, appName, importerFilePath, importeeFilePath);
      }
    });
  });

  return graph;
}

function dedupeGraph(graph) {
  Object.keys(graph).forEach(app => {
    graph[app].appsToTest = [...new Set(graph[app].appsToTest)];
  });

  return graph;
}

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

const ignoredApps = new Set(['static-pages', 'platform']);

const appHasCrossAppImports = (importGraph, appFolder) => {
  const importedFrom = importGraph[appFolder].appsThatThisAppImportsFrom;
  const importedTo = importGraph[appFolder].appsThatImportFromThisApp;

  const hasRelevantImportsFrom = Object.keys(importedFrom).some(
    app => !ignoredApps.has(app),
  );

  const hasRelevantImportsTo = Object.keys(importedTo).some(
    app => !ignoredApps.has(app),
  );

  return hasRelevantImportsFrom || hasRelevantImportsTo;
};

/**
 * Generates a cross app import graph.
 *
 * @param {string[]} appFolders - Array of app folders in 'src/applications'.
 * @returns {Object|null} Cross app import dependency graph.
 */
const getCrossAppImports = async appFolders => {
  // Suppress errors from 'find-imports' when building graph.
  console.error = () => {};
  console.log('Analyzing app imports...');

  const importGraph = dedupeGraph(await buildGraph());

  const platformImports = await getImportsFast(['src/platform/**/*.*']);

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

// Main execution wrapped in async IIFE
(async () => {
  // Generate full cross app import report when no apps are specified
  if (!appFolders && !checkAllowlist) {
    const outputPath = path.join('./tmp', 'cross-app-imports.json');
    const crossAppJson = await getCrossAppImports();
    fs.outputFileSync(outputPath, JSON.stringify(crossAppJson, null, 2));
    core.exportVariable(
      'APPS_NOT_ISOLATED',
      JSON.stringify(
        Object.keys(crossAppJson).filter(app =>
          appHasCrossAppImports(crossAppJson, app),
        ),
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

  const crossAppImports = await getCrossAppImports(appFolders);
  if (crossAppImports && failOnCrossAppImport) {
    // For clarity, only show apps that have cross app imports
    const checkApp = (appObj, app) =>
      appHasCrossAppImports(crossAppImports, app);
    const filteredImports = pickBy(crossAppImports, checkApp);
    console.log('Cross app imports found:');
    console.log(JSON.stringify(filteredImports, null, 2));
    process.exit(1);
  } else if (crossAppImports) {
    console.log(JSON.stringify(crossAppImports, null, 2));
  } else {
    console.log('No cross app imports were found!');
  }
})();
