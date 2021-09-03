/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const findImports = require('find-imports');

const graph = {};

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

function updateGraph(appName, importerFilePath, importeeFilePath) {
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
        updateGraph(appName, importerFilePath, importeeFilePath);
      }
    });
  });
}

function dedupeGraph() {
  Object.keys(graph).forEach(app => {
    graph[app].appsToTest = [...new Set(graph[app].appsToTest)];
  });
}

function writeGraph() {
  try {
    fs.writeFileSync(
      path.resolve(__dirname, '../../config/cross_app_import_graph.json'),
      JSON.stringify(graph, null, 2),
    );

    // eslint-disable-next-line no-console
    console.log('File saved: config/cross_app_import_graph.json');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

buildGraph();
dedupeGraph();
writeGraph();

return undefined;
