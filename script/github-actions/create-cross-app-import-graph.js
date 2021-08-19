const fs = require('fs');
const path = require('path');
const findImports = require('find-imports');
const core = require('@actions/core');

function diffIncludesSrcApplicationsFiles(diff) {
  return diff.includes('diff --git a/src/applications');
}

function isSrcAppicationFileDiff(fileDiff) {
  const str = fileDiff.replace('diff --git a/', '');
  const changedFilePath = str.slice(0, str.indexOf(' '));
  return changedFilePath.startsWith('src/applications');
}

function getAppName(filePath) {
  return filePath.split('/')[2];
}

function sliceDiffIntoDiffForEachChangedFile(diff) {
  const diffForEachChangedFile = [];
  const startOfChange = 'diff --git a/src/applications';
  const endOfChange = 'diff --git a/';
  let start = null;

  for (let i = 0; i <= diff.length; i += 1) {
    if (
      !start &&
      diff[i] === startOfChange[0] &&
      diff.slice(i, i + startOfChange.length) === startOfChange
    ) {
      start = i;
    } else if (
      start &&
      endOfChange &&
      diff[i] === endOfChange[0] &&
      diff.slice(i, i + endOfChange.length) === endOfChange
    ) {
      diffForEachChangedFile.push(diff.slice(start, i));
      start = null;
    } else if (start && i === diff.length - 1) {
      diffForEachChangedFile.push(diff.slice(start));
    }
  }

  // eslint-disable-next-line no-console
  console.log('diffForEachChangedFile:', diffForEachChangedFile);
  return diffForEachChangedFile;
}

function shouldRebuildGraph(diff) {
  const diffForEachChangedFile = sliceDiffIntoDiffForEachChangedFile(diff);
  const srcApplicationFileDiffs = diffForEachChangedFile.filter(fileDiff => {
    return isSrcAppicationFileDiff(fileDiff);
  });

  // eslint-disable-next-line no-console
  console.log('srcApplicationFileDiffs:', srcApplicationFileDiffs);

  for (let i = 0; i < srcApplicationFileDiffs.length; i += 1) {
    const includesImport = /import.+from.+;/g.test(srcApplicationFileDiffs[i]);
    const includesRequire = srcApplicationFileDiffs[i].includes("require('");

    // eslint-disable-next-line no-console
    console.log('includesImport:', includesImport);

    // eslint-disable-next-line no-console
    console.log('includesRequire:', includesRequire);

    if (includesImport || includesRequire) {
      // eslint-disable-next-line no-console
      console.log('shouldRebuildGraph = TRUE');
      return true;
    }
  }

  // eslint-disable-next-line no-console
  console.log('shouldRebuildGraph = FALSE');
  return false;
}

function buildGraph(graph) {
  const files = ['src/applications/**/*.*'];
  const imports = findImports(files, {
    absoluteImports: true,
    relativeImports: true,
    packageImports: false,
  });

  Object.keys(imports).forEach(file => {
    const appName = getAppName(file);
    const filePathAsArray = file.split('/');

    // eslint-disable-next-line no-param-reassign
    if (!graph[appName]) graph[appName] = [appName];

    imports[file].forEach(importRelPath => {
      if (importRelPath.startsWith('../')) {
        const numDirsUp = importRelPath.split('/').filter(str => str === '..')
          .length;
        const importPath = importRelPath.replace(
          '../'.repeat(numDirsUp),
          `${filePathAsArray
            .slice(0, filePathAsArray.length - 1 - numDirsUp)
            .join('/')}/`,
        );

        if (
          importPath.startsWith('src/applications') &&
          !importPath.startsWith(`src/applications/${appName}`)
        ) {
          const importAppName = getAppName(importPath);

          // eslint-disable-next-line no-param-reassign
          if (!graph[importAppName]) graph[importAppName] = [importAppName];

          graph[appName].push(importAppName);
          graph[importAppName].push(appName);
        }
      }
    });
  });
}

function dedupeGraph(graph) {
  Object.keys(graph).forEach(app => {
    // eslint-disable-next-line no-param-reassign
    graph[app] = [...new Set(graph[app])];
  });
}

function writeGraph(graph) {
  try {
    fs.writeFileSync(
      path.resolve(__dirname, '../../config/cross_app_import_graph.json'),
      JSON.stringify(graph, null, 2),
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

function run() {
  const diff = process.env.DIFF_RESULTS;

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
