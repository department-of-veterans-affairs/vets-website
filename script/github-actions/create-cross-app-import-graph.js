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

// function getImportFilename(importPath) {
//   const importPathAsArray = importPath.split('/');
//   return importPathAsArray[importPathAsArray.length - 1];
// }

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

function getDeletions(diffLines) {
  return diffLines.filter(
    line => line.startsWith('-') && !line.startsWith('---'),
  );
}

function getAdditions(diffLines) {
  return diffLines.filter(
    line => line.startsWith('+') && !line.startsWith('+++'),
  );
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

  // eslint-disable-next-line no-console
  console.log('diffForEachChangedFile:', diffForEachChangedFile);
  return diffForEachChangedFile;
}

function isSrcAppicationFileDiff(fileDiff) {
  return fileDiff.replace('diff --git a/', '').startsWith('src/applications');
}

function diffIncludesImport(srcApplicationFileDiff) {
  const includesImport = /import /g.test(srcApplicationFileDiff);
  // eslint-disable-next-line no-console
  console.log('includesImport:', includesImport);
  return includesImport;
}

function diffIncludesRequire(srcApplicationFileDiff) {
  const includesRequire = srcApplicationFileDiff.includes("require('");
  // eslint-disable-next-line no-console
  console.log('includesRequire:', includesRequire);
  return includesRequire;
}

function getSrcApplicationDiffs(diff) {
  return sliceDiffIntoDiffForEachChangedFile(diff)
    .filter(fileDiff => {
      return isSrcAppicationFileDiff(fileDiff);
    })
    .map(fileDiff => {
      const appPath = getAppPathFromFileDiff(fileDiff);
      const name = getAppNameFromFilePath(appPath);
      const diffLines = fileDiff.split('new_line');

      return {
        diff: fileDiff,
        path: appPath,
        name,
        includesImport: diffIncludesImport(fileDiff),
        includesRequire: diffIncludesRequire(fileDiff),
        deletions: getDeletions(diffLines),
        additions: getAdditions(diffLines),
      };
    });
}

function getImportPath(filePathAsArray, importRelPath) {
  if (importRelPath.startsWith('../')) {
    const numDirsUp = importRelPath.split('/').filter(str => str === '..')
      .length;

    return importRelPath.replace(
      '../'.repeat(numDirsUp),
      `${filePathAsArray
        .slice(0, filePathAsArray.length - 1 - numDirsUp)
        .join('/')}/`,
    );
  } else {
    return importRelPath;
  }
}

// function getImportPaths(filePathAsArray, importRelPaths) {
//   return importRelPaths.map(importRelPath => {
//     return getImportPath(filePathAsArray, importRelPath);
//   });
// }

// function getFilenamesMentionedInDeletedLines(deletions) {
//   const filenames = [];

//   deletions.forEach(line => {
//   });

//   return filenames;
// }

function importIsFromOtherApplication(appName, importPath) {
  return (
    importPath.startsWith('src/applications') &&
    !importPath.startsWith(`src/applications/${appName}`)
  );
}

function diffIncludesImportedFilename(srcApplicationFileDiff, importPath) {
  const importPathAsArray = importPath.split('/');
  const importFileName = importPathAsArray[importPathAsArray.length - 1];

  // eslint-disable-next-line no-console
  console.log('Import filename: ', importFileName);

  if (srcApplicationFileDiff.includes(importFileName)) {
    // eslint-disable-next-line no-console
    console.log(
      'Import filename is in diff, so it was probably changed', // filename should be on line with + or - representing it was
    );
    // eslint-disable-next-line no-console
    console.log('shouldRebuildGraph = TRUE');
    return true;
  }

  return false;
}

// function deletionsIncludesFileNotReportedInImports(relPaths, deletions) {
//   const importedFileNames = relPaths(relPath => getImportFilename(relPath));
// }

function shouldRebuildGraph(diff) {
  const srcApplicationDiffs = getSrcApplicationDiffs(diff);

  // eslint-disable-next-line no-console
  console.log('srcApplicationDiffs:', srcApplicationDiffs);

  for (let i = 0; i < srcApplicationDiffs.length; i += 1) {
    const srcApplicationDiff = srcApplicationDiffs[i];

    if (
      srcApplicationDiff.includesImport ||
      srcApplicationDiff.includesRequire
    ) {
      const filePathAsArray = srcApplicationDiff.path.split('/');
      const imports = getImports(srcApplicationDiff.path);
      const importRelPaths = imports[Object.keys(imports)[0]];
      // const importPaths = getImportPaths(filePathAsArray, importRelPaths);
      // const filenamesMentionedInDeletedLines = getFilenamesMentionedInDeletedLines(
      //   srcApplicationDiff.deletions,
      // );

      // eslint-disable-next-line no-console
      console.log('Imports in shouldRebuildGraph(): ', imports);

      for (let j = 0; j < importRelPaths.length; j += 1) {
        const importRelPath = importRelPaths[j];

        if (!importRelPath.startsWith('./')) {
          const importPath = getImportPath(filePathAsArray, importRelPath);

          if (
            importIsFromOtherApplication(srcApplicationDiff.name, importPath) &&
            diffIncludesImportedFilename(srcApplicationDiff.diff, importPath)
          ) {
            return true;
          }

          // if (
          //   importIsFromOtherApplication(srcApplicationDiff.name, importPath) &&
          //   (diffIncludesImportedFilename(
          //     srcApplicationDiff.diff,
          //     importPath,
          //   ) ||
          //     deletionsIncludesFileNotReportedInImports( // maybe delete this
          //       importRelPaths,
          //       srcApplicationDiff.deletions,
          //     ))
          // ) {
          //   return true;
          // }
        }
      }
    }
  }

  // for (let i = 0; i < srcApplicationFileDiffs.length; i += 1) {
  //   const srcApplicationFileDiff = srcApplicationFileDiffs[i];

  //   if (
  //     diffIncludesImport(srcApplicationFileDiff) ||
  //     diffIncludesRequire(srcApplicationFileDiff)
  //   ) {
  //     const appName = getAppNameFromFilePath(
  //       getAppPathFromFileDiff(srcApplicationFileDiff),
  //     ); // in object
  //     const filePath = getAppPathFromFileDiff(srcApplicationFileDiff); // in object
  //     const filePathAsArray = filePath.split('/');
  //     const imports = getImports(filePath);
  //     const importRelPaths = imports[Object.keys(imports)[0]];

  //     // eslint-disable-next-line no-console
  //     console.log('Imports in shouldRebuildGraph(): ', imports);

  //     for (let j = 0; j < importRelPaths.length; j += 1) {
  //       const importRelPath = importRelPaths[j];

  //       if (!importRelPath.startsWith('./')) {
  //         const importPath = getImportPath(filePathAsArray, importRelPath);

  //         if (
  //           importIsFromOtherApplication(appName, importPath) &&
  //           diffIncludesImportedFilename(srcApplicationFileDiff, importPath)
  //         ) {
  //           return true;
  //         }
  //       }
  //     }
  //   }
  // }

  // eslint-disable-next-line no-console
  console.log('shouldRebuildGraph = FALSE');
  return false;
}

function updateGraph(graph, appName, importAppName) {
  // eslint-disable-next-line no-param-reassign
  if (!graph[importAppName]) graph[importAppName] = [importAppName];
  graph[appName].push(importAppName);
  graph[importAppName].push(appName);
}

function buildGraph(graph) {
  const files = ['src/applications/**/*.*'];
  const imports = getImports(files);

  Object.keys(imports).forEach(file => {
    const appName = getAppNameFromFilePath(file);
    const filePathAsArray = file.split('/');

    // eslint-disable-next-line no-param-reassign
    if (!graph[appName]) graph[appName] = [appName];

    imports[file].forEach(importRelPath => {
      if (!importRelPath.startsWith('./')) {
        const importPath = getImportPath(filePathAsArray, importRelPath);

        if (importIsFromOtherApplication(appName, importPath)) {
          updateGraph(graph, appName, getAppNameFromFilePath(importPath));
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
