const fs = require('fs');
const path = require('path');
const findImports = require('find-imports');
const core = require('@actions/core');

function diffIncludesSrcApplicationsFiles(diff) {
  return diff.includes('diff --git a/src/applications');
}

function getAppNameFromFilePath(filePath) {
  return filePath.split('/')[2];
}

function isSrcAppicationFileDiff(fileDiff) {
  return fileDiff.replace('diff --git a/', '').startsWith('src/applications');
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
      startOfDiffIndex === null &&
      diff[i] === startOfChange[0] &&
      diff.slice(i, i + startOfChange.length) === startOfChange
    ) {
      // eslint-disable-next-line no-console
      console.log('i = ', i);
      // eslint-disable-next-line no-console
      console.log('In condition 1');
      startOfDiffIndex = i;
    } else if (
      startOfDiffIndex !== null &&
      endOfChange &&
      diff[i] === endOfChange[0] &&
      diff.slice(i, i + endOfChange.length) === endOfChange
    ) {
      // eslint-disable-next-line no-console
      console.log('i = ', i);
      // eslint-disable-next-line no-console
      console.log('In condition 2');
      diffForEachChangedFile.push(diff.slice(startOfDiffIndex, i));
      startOfDiffIndex = null;
    } else if (startOfDiffIndex !== null && i === diff.length - 1) {
      // eslint-disable-next-line no-console
      console.log('i = ', i);
      // eslint-disable-next-line no-console
      console.log('In condition 3');
      diffForEachChangedFile.push(diff.slice(startOfDiffIndex));
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
    const srcApplicationFileDiff = srcApplicationFileDiffs[i];
    const includesImport = /import.+from.+;/g.test(srcApplicationFileDiff);
    const includesRequire = srcApplicationFileDiff.includes("require('");

    // eslint-disable-next-line no-console
    console.log('includesImport:', includesImport);

    // eslint-disable-next-line no-console
    console.log('includesRequire:', includesRequire);

    if (includesImport || includesRequire) {
      const appName = getAppNameFromFilePath(
        getAppPathFromFileDiff(srcApplicationFileDiff),
      );
      const filePath = getAppPathFromFileDiff(srcApplicationFileDiff);
      const filePathAsArray = filePath.split('/');

      const imports = findImports(filePath, {
        absoluteImports: true,
        relativeImports: true,
        packageImports: false,
      });

      // eslint-disable-next-line no-console
      console.log('Imports in shouldRebuildGraph(): ', imports);
      // eslint-disable-next-line no-console
      console.log('It should be an array with on file');

      // eslint-disable-next-line consistent-return
      Object.keys(imports).forEach(file => {
        for (let j = 0; j < imports[file]; j += 1) {
          const importRelPath = imports[file][j];
          let importPath;

          if (importRelPath.startsWith('../')) {
            const numDirsUp = importRelPath
              .split('/')
              .filter(str => str === '..').length;
            importPath = importRelPath.replace(
              '../'.repeat(numDirsUp),
              `${filePathAsArray
                .slice(0, filePathAsArray.length - 1 - numDirsUp)
                .join('/')}/`,
            );
          } else {
            importPath = importRelPath;
          }

          if (
            importPath.startsWith('src/applications') &&
            !importPath.startsWith(`src/applications/${appName}`)
          ) {
            const importPathAsArray = importPath.split('/');
            const importFileName =
              importPathAsArray[importPathAsArray.length - 1];

            if (srcApplicationFileDiff.includes(importFileName)) {
              // eslint-disable-next-line no-console
              console.log('shouldRebuildGraph = TRUE');
              return true;
            }
          }
        }
      });
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
    const appName = getAppNameFromFilePath(file);
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
          const importAppName = getAppNameFromFilePath(importPath);

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
