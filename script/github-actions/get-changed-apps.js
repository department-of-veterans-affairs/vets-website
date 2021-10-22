/* eslint-disable no-console */
const find = require('find');
const path = require('path');
const core = require('@actions/core');
const commandLineArgs = require('command-line-args');

const changedAppsConfig = require('../../config/single-app-build.json');

const options = commandLineArgs([
  { name: 'app-folders', type: Boolean, defaultValue: false },
]);

const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ').filter(
  filePath => filePath.startsWith('src/applications'),
);

/**
 * Gets the `entryName` of the app that a file belongs to.
 *
 * @param {string} filePath - Relative file path.
 * @returns {string} The entry name of an app.
 */
const getEntryName = filePath => {
  const root = path.join(__dirname, '../..');
  const appDirectory = filePath.split('/')[2];
  const fullPath = path.join(root, `./src/applications/${appDirectory}`);

  const manifestFile = find
    .fileSync(/manifest\.(json|js)$/, fullPath)
    // eslint-disable-next-line import/no-dynamic-require
    .map(file => require(file))[0];

  return manifestFile.entryName;
};

/**
 * If the provided file is part of an app, and that app is in the allow list,
 * returns the app entry name. Otherwise returns null
 *
 * @param {string} file - Relative file path.
 * @param {string[]} appList - A list of application `entryNames`.
 * @returns {string|null} Either the `entryName` or relative path app of an app. Otherwise null.
 */
const getAllowedApp = (file, appList) => {
  const entryName = getEntryName(file);

  if (file.startsWith('src/applications') && appList.includes(entryName)) {
    // Return app path when 'app-folders' option is used
    if (options['app-folders']) {
      const appFolderName = file.split('/')[2];
      return `src/applications/${appFolderName}`;
    }
    return entryName;
  }

  return null;
};

/**
 * Given a list of files and an app allow list, checks if a single app build
 * is possible. If so, returns a comma-separated list of app entry names.
 * If not, returns an empty string
 *
 * @param {string[]} files - An array of relative file paths.
 * @param {string[]} allowList - A list of application `entryNames`.
 * @returns {string} A comma-delimited string containing either app `entryNames` or relative paths.
 */
const getChangedAppsString = (files, allowList) => {
  const allowedApps = [];

  for (const file of files) {
    const allowedApp = getAllowedApp(file, allowList);
    if (allowedApp) {
      allowedApps.push(allowedApp);
    } else {
      return '';
    }
  }

  return [...new Set(allowedApps)].join(',');
};

core.exportVariable(
  'CHANGED_APPS',
  getChangedAppsString(changedFiles, changedAppsConfig),
);
