/* eslint-disable no-param-reassign */
const findImports = require('find-imports');

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

function run() {
  dedupeGraph(buildGraph());
}

run();
