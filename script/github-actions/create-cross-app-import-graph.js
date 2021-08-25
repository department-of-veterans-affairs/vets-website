const fs = require('fs');
const path = require('path');
const findImports = require('find-imports');
const core = require('@actions/core');

// Example diffs:
// srcApplicationFileDiffs: [
//   "diff --git a/src/applications/ask-a-question/form/contactInformation/contactInformationPage.js b/src/applications/ask-a-question/form/contactInformation/contactInformationPage.js index 2d88eed33..7b6b3d683 100644 --- a/src/applications/ask-a-question/form/contactInformation/contactInformationPage.js +++ b/src/applications/ask-a-question/form/contactInformation/contactInformationPage.js @@ -4 +4 @@ import emailUI from 'platform/forms-system/src/js/definitions/email'; -import { confirmationEmailUI } from 'applications/caregivers/definitions/UIDefinitions/sharedUI'; +// import { confirmationEmailUI } from 'applications/caregivers/definitions/UIDefinitions/sharedUI'; @@ -14 +14 @@ import { - verifyEmailAddressError, + // verifyEmailAddressError, @@ -41,8 +41,8 @@ const contactInformationPage = { - [formFields.verifyEmail]: _.merge( - confirmationEmailUI('', formFields.email), - { - 'ui:errorMessages': { - required: verifyEmailAddressError, - }, - }, - ), + // [formFields.verifyEmail]: _.merge( + // confirmationEmailUI('', formFields.email), + // { + // 'ui:errorMessages': { + // required: verifyEmailAddressError, + // }, + // }, + // ),"
// ]

// Each diff as two sets of '@@' before the deletions and additions:
// The first instance of '@@' represents the change lines/columns
// Examples:
// @@ -437,0 +438
// @@ -4 +4

// The second instance of '@@' represents the first line before the line that's being modified that is at col 1
// examples:
// @@ jobs:
// @@ import emailUI from 'platform/forms-system/src/js/definitions/email';
// Note: there's a space after the line, before the '-' or '+'

// Solution:
// Part 1
// in each src/applications diff:
// count up to two instances of @@
// save second the second instance of '@@'
// then look for '-' or '+'
// after 1 '-' or '+', reset counter to 0
// look for @@ again, but continue to look for '-' or '+' because there might be more
// save '-' or '+' to 'deleted' and 'added' arrays for each src/applications diff

// Part 2
// if second instance of '@@' === 'import { ' and a following deleted line has the next closing '}' has 'from' and a path
//  || deleted line starts with 'import'
// get the path
// build the path
// if that path is in a different app, rebuild the graph

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
      startOfDiffIndex === null &&
      diff[i] === startOfChange[0] &&
      diff.slice(i, i + startOfChange.length) === startOfChange
    ) {
      startOfDiffIndex = i;
    } else if (
      startOfDiffIndex !== null &&
      endOfChange &&
      diff[i] === endOfChange[0] &&
      diff.slice(i, i + endOfChange.length) === endOfChange
    ) {
      diffForEachChangedFile.push(diff.slice(startOfDiffIndex, i));
      i -= 1; // reduce i by 1 so the next iteration picks up the beginning of this diff
      startOfDiffIndex = null;
    } else if (startOfDiffIndex !== null && i === diff.length - 1) {
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

function getSrcApplicationDiffs(diff) {
  return sliceDiffIntoDiffForEachChangedFile(diff).filter(fileDiff => {
    return isSrcAppicationFileDiff(fileDiff);
  });
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

function shouldRebuildGraph(diff) {
  const srcApplicationFileDiffs = getSrcApplicationDiffs(diff);

  // eslint-disable-next-line no-console
  console.log('srcApplicationFileDiffs:', srcApplicationFileDiffs);

  for (let i = 0; i < srcApplicationFileDiffs.length; i += 1) {
    const srcApplicationFileDiff = srcApplicationFileDiffs[i];

    if (
      diffIncludesImport(srcApplicationFileDiff) ||
      diffIncludesRequire(srcApplicationFileDiff)
    ) {
      const appName = getAppNameFromFilePath(
        getAppPathFromFileDiff(srcApplicationFileDiff),
      );
      const filePath = getAppPathFromFileDiff(srcApplicationFileDiff);
      const filePathAsArray = filePath.split('/');
      const imports = getImports(filePath);
      const importRelPaths = imports[Object.keys(imports)[0]];

      // eslint-disable-next-line no-console
      console.log('Imports in shouldRebuildGraph(): ', imports);

      for (let j = 0; j < importRelPaths.length; j += 1) {
        const importRelPath = importRelPaths[j];

        if (!importRelPath.startsWith('./')) {
          const importPath = getImportPath(filePathAsArray, importRelPath);

          if (
            importIsFromOtherApplication(appName, importPath) &&
            diffIncludesImportedFilename(srcApplicationFileDiff, importPath)
          ) {
            return true;
          }
        }
      }
    }
  }

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
