/* eslint-disable no-param-reassign */
const core = require('@actions/core');
const path = require('path');
const glob = require('glob');
const { integrationFolder, testFiles } = require('../../config/cypress.json');
const findImports = require('find-imports');

const IS_MASTER_BUILD = process.env.IS_MASTER_BUILD === 'true';

function getImports(filePath) {
  return findImports(filePath, {
    absoluteImports: true,
    relativeImports: true,
    packageImports: false,
  });
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
  } else if (importRef.startsWith('../')) {
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

  graph[importAppName].appsToTest.push(appName);

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

function buildGraph() {
  const graph = {};
  const files = ['src/applications/**/*.*'];
  const imports = getImports(files);

  Object.keys(imports).forEach(importerFilePath => {
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

function selectedTests(graph, pathsOfChangedFiles) {
  const tests = [];
  const applications = [];
  const applicationNames = pathsOfChangedFiles
    .filter(filePath => !filePath.endsWith('.md'))
    .map(filePath => filePath.split('/')[2]);

  [...new Set(applicationNames)].forEach(app => {
    // Lookup app in cross-app imports graph to reference which app's tests
    // should run
    applications.push(...graph[app].appsToTest);
  });

  [...new Set(applications)].forEach(app => {
    const selectedTestsPattern = path.join(
      __dirname,
      '../..',
      'src/applications',
      `${app}/**/tests/**/*.cypress.spec.js?(x)`,
    );

    tests.push(...glob.sync(selectedTestsPattern));
  });

  // Always run the tests in src/platform
  const defaultTestsPattern = path.join(
    __dirname,
    '../..',
    'src/platform',
    '**/tests/**/*.cypress.spec.js?(x)',
  );

  tests.push(...glob.sync(defaultTestsPattern));
  return tests;
}

function allTests() {
  const pattern = path.join(__dirname, '../..', integrationFolder, testFiles);
  return glob.sync(pattern);
}

function selectTests(graph, pathsOfChangedFiles) {
  if (IS_MASTER_BUILD) {
    return allTests();
  } else {
    let allMdFiles = true;
    let allMdAndOrSrcApplicationsFiles = true;

    for (let i = 0; i < pathsOfChangedFiles.length; i += 1) {
      if (!pathsOfChangedFiles[i].endsWith('.md')) {
        allMdFiles = false;
      }

      if (
        !pathsOfChangedFiles[i].endsWith('.md') &&
        !pathsOfChangedFiles[i].startsWith('src/applications')
      ) {
        allMdAndOrSrcApplicationsFiles = false;
      }

      if (allMdFiles === false && allMdAndOrSrcApplicationsFiles === false) {
        break;
      }
    }

    if (allMdFiles) {
      return [];
    } else if (allMdAndOrSrcApplicationsFiles) {
      return selectedTests(graph, pathsOfChangedFiles);
    } else {
      return allTests();
    }
  }
}

function exportVariables(tests) {
  const numTests = tests.length;

  // core.exportVariable() exports variable to GitHub Actions workflow
  if (numTests === 0) {
    core.exportVariable('NUM_CONTAINERS', 0);
  } else if (numTests <= 20) {
    core.exportVariable('NUM_CONTAINERS', 1);
    core.exportVariable('CI_NODE_INDEX', [0]);
  } else if (numTests <= 40) {
    core.exportVariable('NUM_CONTAINERS', 2);
    core.exportVariable('CI_NODE_INDEX', [0, 1]);
  } else if (numTests <= 60) {
    core.exportVariable('NUM_CONTAINERS', 3);
    core.exportVariable('CI_NODE_INDEX', [0, 1, 2]);
  } else if (numTests <= 80) {
    core.exportVariable('NUM_CONTAINERS', 4);
    core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3]);
  } else if (numTests <= 100) {
    core.exportVariable('NUM_CONTAINERS', 5);
    core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4]);
  } else if (numTests <= 120) {
    core.exportVariable('NUM_CONTAINERS', 6);
    core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4, 5]);
  } else if (numTests <= 140) {
    core.exportVariable('NUM_CONTAINERS', 7);
    core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4, 5, 6]);
  } else {
    core.exportVariable('NUM_CONTAINERS', 8);
    core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4, 5, 6, 7]);
  }

  if (numTests > 0) core.exportVariable('TESTS', tests);
}

function run() {
  const filepaths = process.env.CHANGED_FILE_PATHS.split(' ');
  const pathsOfChangedFiles = filepaths.filter(filepath => {
    // Ignore the cross-app import graph file
    return (
      filepath !== '.github/workflows/continuous-integration.yml' &&
      filepath !== 'config/cross_app_import_graph.json' &&
      filepath !== 'script/github-actions/create-cross-app-import-graph.js' &&
      filepath !== 'script/github-actions/select-cypress-tests.js'
    );
  });
  const graph = dedupeGraph(buildGraph());
  const tests = selectTests(graph, pathsOfChangedFiles);
  exportVariables(tests);
}

run();
