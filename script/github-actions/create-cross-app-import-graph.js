/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const findImports = require('find-imports');
const core = require('@actions/core');

function getImports(filePath) {
  return findImports(filePath, {
    absoluteImports: true,
    relativeImports: true,
    packageImports: false,
  });
}

function diffIncludesSrcApplicationsFiles(diff) {
  return diff.includes('diff --git a/src/applications');
}

function getAppNameFromFilePath(filePath) {
  return filePath.split('/')[2];
}

function getAppPathFromFileDiff(fileDiff) {
  const str = fileDiff.replace('diff --git a/', '');
  return str.slice(0, str.indexOf(' '));
}

function sliceDiffIntoDiffForEachChangedFile(diff) {
  const diffForEachChangedFile = [];
  const startOfChange = 'diff --git a/src/applications';
  const endOfChange = 'diff --git a/';
  let startOfDiffIndex = null;

  for (let i = 0; i <= diff.length; i += 1) {
    if (
      !startOfDiffIndex &&
      diff[i] === startOfChange[0] &&
      diff.slice(i, i + startOfChange.length) === startOfChange
    ) {
      startOfDiffIndex = i;
    } else if (
      startOfDiffIndex &&
      endOfChange &&
      diff[i] === endOfChange[0] &&
      diff.slice(i, i + endOfChange.length) === endOfChange
    ) {
      diffForEachChangedFile.push(diff.slice(startOfDiffIndex, i));
      i -= 1; // reduce i by 1 so the next iteration picks up the beginning of this diff
      startOfDiffIndex = null;
    } else if (startOfDiffIndex && i === diff.length - 1) {
      diffForEachChangedFile.push(diff.slice(startOfDiffIndex));
    }
  }

  return diffForEachChangedFile;
}

function isSrcAppicationFileDiff(fileDiff) {
  return fileDiff.replace('diff --git a/', '').startsWith('src/applications');
}

function getSrcApplicationDiffs(diff) {
  return sliceDiffIntoDiffForEachChangedFile(diff).filter(fileDiff => {
    return isSrcAppicationFileDiff(fileDiff);
  });
}

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
  } else {
    return importRef;
  }
}

function importIsFromOtherApplication(appName, importPath) {
  return (
    importPath.startsWith('src/applications') &&
    !importPath.startsWith(`src/applications/${appName}`)
  );
}

function getChanges(fileDiff) {
  return fileDiff.split('new_line').filter(line => {
    return (
      (line.startsWith('-') && !line.startsWith('---')) ||
      (line.startsWith('+') && !line.startsWith('+++'))
    );
  });
}

function lineIsPartOfImport(line) {
  return (
    line.includes('import') ||
    line.includes('@import') ||
    line.includes('} from')
  );
}

function lineIncludesRequire(line) {
  return line.includes('= require(');
}

function getImportRef(line) {
  let start = null;
  let finish = null;
  let lookForSingleQuote = true;
  let lookForDoubleQuote = true;

  for (let i = 0; i < line.length; i += 1) {
    if (!start && (line[i] === "'" || line[i] === '"')) {
      start = i + 1;
      if (line[i] === "'") {
        lookForDoubleQuote = false;
      } else {
        lookForSingleQuote = false;
      }
    } else if (
      start &&
      ((lookForSingleQuote && line[i] === "'") ||
        (lookForDoubleQuote && line[i] === '"'))
    ) {
      finish = i;
      break;
    }
  }

  return line.slice(start, finish);
}

function isCrossAppImport(fileDiff, line) {
  const filePath = getAppPathFromFileDiff(fileDiff);
  const filePathAsArray = filePath.split('/');
  const appName = getAppNameFromFilePath(filePath);
  const importRef = getImportRef(line);
  const importPath = getImportPath(filePathAsArray, importRef);
  return importIsFromOtherApplication(appName, importPath);
}

function changesIncludeChangesToCrossAppImports(srcApplicationDiff) {
  const changes = getChanges(srcApplicationDiff);

  for (let i = 0; i < changes.length; i += 1) {
    const line = changes[i];

    if (
      (lineIsPartOfImport(line) || lineIncludesRequire(line)) &&
      isCrossAppImport(srcApplicationDiff, line)
    ) {
      return true;
    }
  }

  return false;
}

function shouldRebuildGraph(diff) {
  const srcApplicationDiffs = getSrcApplicationDiffs(diff);

  // eslint-disable-next-line no-console
  console.log('srcApplicationDiffs:', srcApplicationDiffs);

  for (let i = 0; i < srcApplicationDiffs.length; i += 1) {
    if (changesIncludeChangesToCrossAppImports(srcApplicationDiffs[i])) {
      return true;
    }
  }

  return false;
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

function buildGraph(graph) {
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
}

function dedupeGraph(graph) {
  Object.keys(graph).forEach(app => {
    graph[app].appsToTest = [...new Set(graph[app].appsToTest)];
  });
}

function writeGraph(graph) {
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

function run() {
  const diff = process.env.DIFF_RESULTS;

  // eslint-disable-next-line no-console
  console.error('Diff: ', diff);

  if (diffIncludesSrcApplicationsFiles(diff) && shouldRebuildGraph(diff)) {
    const graph = {};
    buildGraph(graph);
    dedupeGraph(graph);
    writeGraph(graph);
    core.exportVariable('IS_GRAPH_UPDATED', true);
  } else {
    core.exportVariable('IS_GRAPH_UPDATED', false);
  }
}

run();
