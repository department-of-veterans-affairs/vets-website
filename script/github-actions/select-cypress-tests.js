/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const findImports = require('find-imports');

console.log(findImports);
const {
  e2e: { specPattern },
} = require('../../config/cypress.config');

const CHANGED_FILE_PATHS = process.env.CHANGED_FILE_PATHS
  ? process.env.CHANGED_FILE_PATHS.split(' ')
  : [];

const IS_CHANGED_APPS_BUILD = Boolean(process.env.APP_ENTRIES);
const RUN_FULL_SUITE = process.env.RUN_FULL_SUITE === 'true';
const APPS_HAVE_URLS = Boolean(process.env.APP_URLS);

const ALLOW_LIST =
  process.env.TEST_TYPE &&
  fs.existsSync(path.resolve(`${process.env.TEST_TYPE}_allow_list.json`))
    ? JSON.parse(
        fs.readFileSync(
          path.resolve(`${process.env.TEST_TYPE}_allow_list.json`),
        ),
      )
    : [];

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
  const files = ['src/applications/**/*.*', '!src/applications/*.*'];
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

  console.log(applicationNames);

  [...new Set(applicationNames)].forEach(app => {
    if (graph[app]) {
      // Lookup app in cross-app imports graph to reference which app's tests
      // should run
      applications.push(...graph[app].appsToTest);
    }
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

  // Only run the mega menu test for changed apps builds,
  // otherwise run all tests in src/platform for full builds
  if (IS_CHANGED_APPS_BUILD) {
    const megaMenuTestPath = path.join(
      __dirname,
      '../..',
      'src/platform/site-wide/mega-menu/tests/megaMenu.cypress.spec.js',
    );

    // Ensure changed apps have URLs to run header test on
    if (APPS_HAVE_URLS && fs.existsSync(megaMenuTestPath))
      tests.push(megaMenuTestPath);
  } else {
    const defaultTestsPattern = path.join(
      __dirname,
      '../..',
      'src/platform',
      '**/tests/**/*.cypress.spec.js?(x)',
    );

    tests.push(...glob.sync(defaultTestsPattern));
  }

  return tests;
}

function allTests() {
  const pattern = path.join(__dirname, '../..', specPattern);
  return glob.sync(pattern);
}

function selectTests(graph, pathsOfChangedFiles) {
  if (RUN_FULL_SUITE) {
    return allTests();
  }
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
  }
  if (allMdAndOrSrcApplicationsFiles) {
    return selectedTests(graph, pathsOfChangedFiles);
  }
  return allTests();
}

function exportVariables(tests) {
  const numTests = tests.length;

  if (numTests <= 200) {
    core.exportVariable('NUM_CONTAINERS', 8);
    core.exportVariable('CI_NODE_INDEX', [0, 1, 2, 3, 4, 5, 6, 7]);
  } else {
    core.exportVariable('NUM_CONTAINERS', 12);
    core.exportVariable('CI_NODE_INDEX', [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
    ]);
  }
  core.exportVariable('TESTS', tests);
}

function main() {
  const graph = dedupeGraph(buildGraph());

  const allAllowListSpecs = ALLOW_LIST.map(spec => spec.spec_path);

  // groups of tests from the allow list
  const allDisallowedTestPaths = ALLOW_LIST.filter(
    spec => spec.allowed === false,
  ).map(spec => spec.spec_path);

  const testsSelectedByTestSelection = selectTests(graph, CHANGED_FILE_PATHS);

  const disallowedTests = testsSelectedByTestSelection.filter(test =>
    allDisallowedTestPaths.includes(test.substring(test.indexOf('src/'))),
  );

  const testsToRunNormally = testsSelectedByTestSelection.filter(
    test => !disallowedTests.includes(test),
  );

  const changedAppsForStressTest = CHANGED_FILE_PATHS
    ? CHANGED_FILE_PATHS.map(filePath =>
        filePath
          .split('/')
          .slice(0, 3)
          .join('/'),
      )
    : [];

  const existingTestsToStressTest = allAllowListSpecs.filter(specPath =>
    changedAppsForStressTest.some(filePath => specPath.includes(filePath)),
  );

  const newTestsToStressTest = CHANGED_FILE_PATHS.filter(
    filePath =>
      filePath.includes('.cypress.spec.js') &&
      allAllowListSpecs.indexOf(path) === -1,
  );

  const testsToStressTest = existingTestsToStressTest
    .concat(newTestsToStressTest)
    .filter(testSpec => fs.existsSync(testSpec));

  exportVariables(testsToRunNormally);

  if (RUN_FULL_SUITE) {
    core.exportVariable('TESTS_TO_STRESS_TEST', allAllowListSpecs);
  } else {
    core.exportVariable('TESTS_TO_STRESS_TEST', testsToStressTest);
  }
}
if (RUN_FULL_SUITE || ALLOW_LIST.length > 0) {
  main();
}

module.exports = {
  buildGraph,
  dedupeGraph,
};
