/* eslint-disable no-console */
const find = require('find');
const path = require('path');
const core = require('@actions/core');

/**
 * Takes a relative path and returns the entryName of
 * the app that the given path belongs to
 *
 * @param {string} filePath
 * @returns {string}
 */
const getEntryName = filePath => {
  const root = path.join(__dirname, '../..');
  const appDirectory = filePath.split('/')[2];
  const manifestFile = find
    .fileSync(
      /manifest\.(json|js)$/,
      path.join(root, `./src/applications/${appDirectory}`),
    )
    // eslint-disable-next-line import/no-dynamic-require
    .map(file => require(file))[0];

  return manifestFile.entryName;
};

const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ');
let isSingleAppBuild = true;
const appEntryNames = [];

changedFiles.forEach(file => {
  if (file.startsWith('src/applications')) {
    appEntryNames.push(getEntryName(file));
  } else {
    isSingleAppBuild = false; // all non-app changes require a full build
  }
});

core.exportVariable('IS_SINGLE_APP_BUILD', isSingleAppBuild);
core.exportVariable('APP_ENTRY_NAMES', appEntryNames.join(','));
