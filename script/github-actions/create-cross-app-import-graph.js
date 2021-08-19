const fs = require('fs');
const path = require('path');
const findImports = require('find-imports');
const core = require('@actions/core');

const diff = process.env.DIFF_RESULTS;
const graph = {};
// log diff for workflow debugging
// eslint-disable-next-line no-console
console.log('Diff: ', diff);

function diffIncludesSrcApplicationsFile() {
  return diff.includes('diff --git a/src/applications');
}

// function getChangedFilePath(change) {
//   const str = change.replace('diff --git a/', '');
//   return str.slice(0, str.indexOf(' '));
// }

function getAppName(filePath) {
  return filePath.split('/')[2];
}

// function getImportedPath(change, changedFilePath) {
//   const filePaths = [];
//   return filePaths;
// }

// function getRequiredPath(change, changedFilePath) {
//   const filePaths = [];
//   return filePaths;
// }

// function importsFromDifferentApp(change, importPaths, requirePaths) {
//   const filePath = getChangedFilePath(change);
//   const importFilePaths =
//     importPaths === undefined ? requirePaths : importPaths;

//   for (let i = 0; i < importFilePaths.length; i += 1) {
//     if (
//       !importFilePaths[i].startsWith(`src/applications/${getAppName(filePath)}`)
//     ) {
//       return true;
//     }
//   }

//   return false;
// }

function sliceDiff({ str, startOfChange, endOfChange }) {
  const slices = [];
  let start = null;

  for (let i = 0; i <= str.length; i += 1) {
    if (
      !start &&
      str[i] === startOfChange[0] &&
      str.slice(i, i + startOfChange.length) === startOfChange
    ) {
      start = i;
    } else if (
      start &&
      endOfChange &&
      str[i] === endOfChange[0] &&
      str.slice(i, i + endOfChange.length) === endOfChange
    ) {
      slices.push(str.slice(start, i));
      start = null;
    } else if (start && i === str.length - 1) {
      slices.push(str.slice(start));
    }
  }

  // // eslint-disable-next-line no-console
  // console.log('slices:', slices);
  return slices;
}

function shouldRebuildGraph() {
  const diffs = sliceDiff({
    str: diff,
    startOfChange: 'diff --git a/src/applications',
    endOfChange: 'diff --git a/',
  });

  for (let i = 0; i < diffs.legnth; i += 1) {
    const change = sliceDiff({
      str: diffs[i],
      startOfChange: '+++ b/',
      endOfChange: null,
    });

    // const changedFilePath = getChangedFilePath(change);
    const includesImport = /import.+from.+;/g.test(change);
    const includesRequire = change.includes("require('");

    if (includesImport || includesRequire) {
      // let importPaths;
      // let requirePaths;

      // if (includesImport) {
      //   importPaths = getImportedPath(change, changedFilePath);
      // } else {
      //   requirePaths = getRequiredPath(change, changedFilePath);
      // }

      // if (importsFromDifferentApp(change, importPaths, requirePaths)) {
      //   // eslint-disable-next-line no-console
      //   console.log('shouldRebuildGraph = TRUE');
      //   return true;
      // }
      // eslint-disable-next-line no-console
      console.log('shouldRebuildGraph = TRUE');
      return true;
    }
  }

  // eslint-disable-next-line no-console
  console.log('shouldRebuildGraph = FALSE');
  return false;
}

function buildGraph() {
  const files = ['src/applications/**/*.*'];
  const imports = findImports(files, {
    absoluteImports: true,
    relativeImports: true,
    packageImports: false,
  });

  Object.keys(imports).forEach(file => {
    const appName = getAppName(file);
    const filePathAsArray = file.split('/');

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

          if (!graph[importAppName]) graph[importAppName] = [importAppName];

          graph[appName].push(importAppName);
          graph[importAppName].push(appName);
        }
      }
    });
  });
}

function dedupeGraph() {
  Object.keys(graph).forEach(app => {
    graph[app] = [...new Set(graph[app])];
  });
}

function writeGraph() {
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

if (diffIncludesSrcApplicationsFile() && shouldRebuildGraph()) {
  core.exportVariable('IS_GRAPH_UPDATED', true);
  buildGraph();
  dedupeGraph();
  writeGraph();
} else {
  core.exportVariable('IS_GRAPH_UPDATED', false);
}
