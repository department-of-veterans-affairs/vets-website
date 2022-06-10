/* eslint-disable no-console */
const fs = require('fs');
const find = require('find');
const path = require('path');
const core = require('@actions/core');

const changedAppsConfig = require('../../config/changed-apps-build.json');

/**
 * Gets the manifest of all apps in the root app folder that a file belongs to.
 *
 * @param {string} filePath - Relative file path.
 * @returns {Object[]} Application manifests.
 */
const getManifests = filePath => {
  const root = path.join(__dirname, '../..');
  const rootAppFolder = filePath.split('/')[2];
  const fullAppPath = path.join(root, './src/applications', rootAppFolder);

  if (!fs.existsSync(fullAppPath)) return [];

  return find
    .fileSync(/manifest\.(json|js)$/, fullAppPath)
    .map(file => JSON.parse(fs.readFileSync(file)));
};

/**
 * Gets the sliced manifest(s) of a file's root app folder with some added properties. The
 * app's entry name or root folder must be on the given allow list, otherwise returns null.
 *
 * @param {string} filePath - Relative file path.
 * @param {Object} allow - Lists of entry names and root app folders to check against.
 * @returns {Object[]|null} Sliced manifests of allowed apps. Otherwise null.
 */
const getAllowedApps = (filePath, allow) => {
  const appsDirectory = 'src/applications';

  if (!filePath.startsWith(appsDirectory)) return null;

  const rootAppFolder = filePath.split('/')[2];
  const rootAppPath = path.join(appsDirectory, rootAppFolder);
  const manifests = getManifests(filePath);

  const allowedAppFolder = allow.groupedApps.find(
    groupedApp => groupedApp.rootFolder === rootAppFolder,
  );

  const allowedApp =
    !allowedAppFolder && manifests.length === 1
      ? allow.singleApps.find(
          appEntry => appEntry.entryName === manifests[0].entryName,
        )
      : null;

  const isAllowed = allowedAppFolder || allowedApp;

  if (isAllowed) {
    return manifests.map(({ entryName, rootUrl }) => ({
      entryName,
      rootUrl,
      rootPath: rootAppPath,
      slackGroup: isAllowed.slackGroup,
    }));
  }

  return null;
};

/**
 * Checks if a changed apps build is possible by confirming that all
 * files are from apps on an allow list. If so, returns a comma-delimited string
 * of app entry names, relative paths, or URLs; otherwise returns an empty string.
 *
 * @param {string[]} filePaths - An array of relative file paths.
 * @param {Object} config - The changed apps build config.
 * @param {string} delimiter - Delimiter to use for string output.
 * @returns {string} A delimited string of app entry names, relative paths, URLs, or Slack groups.
 */
const getChangedAppsString = (filePaths, config, delimiter = ' ') => {
  const apps = {
    entryNames: new Set(),
    rootPaths: new Set(),
    rootUrls: new Set(),
    slackGroups: new Set(),
  };

  for (const filePath of filePaths) {
    const allowedApps = getAllowedApps(filePath, config.allow);

    if (allowedApps) {
      allowedApps.forEach(app => {
        apps.entryNames.add(app.entryName);
        apps.rootPaths.add(app.rootPath);
        if (app.rootUrl) apps.rootUrls.add(app.rootUrl);
        if (app.slackGroup) apps.slackGroups.add(app.slackGroup);
      });
    }
  }

  core.setOutput('entry_names', [...apps.entryNames].join(delimiter));
  core.setOutput('folders', [...apps.rootPaths].join(delimiter));
  core.setOutput('urls', [...apps.rootUrls].join(delimiter));
  core.setOutput('slack_groups', [...apps.slackGroups].join(delimiter));
  core.setOutput('test', 'passed');
};

if (process.env.CHANGED_FILE_PATHS) {
  const changedFilePaths = process.env.CHANGED_FILE_PATHS.split(' ');

  getChangedAppsString(
    changedFilePaths,
    changedAppsConfig,
    core.getInput('delimiter'),
  );
}

module.exports = {
  getChangedAppsString,
};
