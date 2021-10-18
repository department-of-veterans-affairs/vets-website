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

  console.log(filePath);

  const manifestFile = find
    .fileSync(
      /manifest\.(json|js)$/,
      path.join(root, `./src/applications/${appDirectory}`),
    )
    .map(file => {
      // eslint-disable-next-line import/no-dynamic-require
      return require(file);
    })[0];

  console.log(manifestFile);
  return manifestFile.entryName;
};

const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ');
const isSingleAppBuild = true;
let appEntryNames = '';

changedFiles.forEach(file => {
  if (!file.startsWith('src/applications')) {
    console.log('Running full build');
    // core.ExitCode(0);
  } else {
    const entryName = getEntryName(file);

    appEntryNames += `${entryName},`;
    console.log(appEntryNames);
  }
});

appEntryNames = 'ask-a-question';

core.exportVariable('IS_SINGLE_APP_BUILD', isSingleAppBuild);
core.exportVariable('APP_ENTRY_NAMES', appEntryNames);
