/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const commandLineArgs = require('command-line-args');

const changedAppsConfig = require('../../config/changed-apps-build.json');

/**
 * Recursively finds all files matching a pattern in a directory.
 * Uses native fs operations for mock-fs compatibility in Node 22+.
 *
 * @param {RegExp} pattern - Regex pattern to match file names.
 * @param {string} directory - Directory to search in.
 * @returns {string[]} Array of matching file paths.
 */
const findFilesSync = (pattern, directory) => {
  const results = [];

  const search = dir => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        search(fullPath);
      } else if (entry.isFile() && pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }
  };

  search(directory);
  return results;
};

/**
 * Gets the manifest of all apps in the root app folder that a file belongs to.
 *
 * @param {string} filePath - Relative file path.
 * @returns {Object[]} Application manifests.
 */
const getManifests = filePath => {
  const root = path.join(__dirname, '../..');
  const rootAppFolderName = filePath.split('/')[2];
  const fullAppPath = path.join(root, './src/applications', rootAppFolderName);

  if (!fs.existsSync(fullAppPath)) return [];

  return findFilesSync(/manifest\.(json|js)$/, fullAppPath).map(file =>
    JSON.parse(fs.readFileSync(file)),
  );
};

/**
 * Gets the sliced manifest(s) of a file's root app folder with some added properties. The
 * app's root folder must be on the given allow list, otherwise returns an empty array.
 *
 * @param {string} filePath - Relative file path.
 * @param {Object} allowedApps - List of allowed apps.
 * @returns {Object[]} Sliced manifests of allowed apps.
 */
const getAllowedApps = (filePath, allowedApps) => {
  const appsDirectory = 'src/applications';

  if (!filePath.startsWith(appsDirectory)) return [];

  const manifests = getManifests(filePath);
  const rootAppFolderName = filePath.split('/')[2];
  const allowedApp = allowedApps.find(
    app => app.rootFolder === rootAppFolderName,
  );

  if (allowedApp) {
    const { slackGroup, slackChannel, continuousDeployment } = allowedApp;
    return manifests.map(({ entryName, rootUrl }) => ({
      entryName,
      rootUrl,
      rootPath: path.join(appsDirectory, rootAppFolderName),
      rootFolder: rootAppFolderName,
      slackGroup,
      slackChannel,
      continuousDeployment,
    }));
  }

  return [];
};

/**
 * Checks if a list of file paths belong to allowed apps. If so, returns a
 * delimited string of application entry names, relative paths, URLs
 * or Slack user groups; otherwise returns an empty string.
 *
 * @param {string[]} filePaths - An array of relative file paths.
 * @param {Object} config - Changed apps config.
 * @param {string} outputType - Determines what app information should be returned.
 * @param {string} delimiter - Delimiter to use for string output.
 * @returns {string} A delimited string of app entry names, relative paths, URLs, or Slack user groups.
 */
const getChangedAppsString = (
  filePaths,
  config,
  outputType = 'entry',
  delimiter = ' ',
) => {
  const appStrings = [];

  for (const filePath of filePaths) {
    const allowedApps = getAllowedApps(filePath, config.apps);

    if (allowedApps.length) {
      allowedApps.forEach(app => {
        if (outputType === 'entry') {
          appStrings.push(app.entryName);
        } else if (outputType === 'folder') {
          appStrings.push(app.rootPath);
        } else if (outputType === 'concurrency-group') {
          appStrings.push(app.rootFolder);
        } else if (outputType === 'slack-group') {
          if (app.slackGroup) appStrings.push(app.slackGroup);
        } else if (outputType === 'slack-channel') {
          if (app.slackChannel) appStrings.push(app.slackChannel);
        } else if (outputType === 'url') {
          if (app.rootUrl) appStrings.push(app.rootUrl);
        } else throw new Error('Invalid output type specified.');
      });
    } else return '';
  }

  return [...new Set(appStrings)].sort().join(delimiter);
};

/**
 * Checks whether all file paths belong to apps on the allowlist with continuous deployment
 * enabled. Returns false if all apps don't have continuous deployed enabled.
 *
 * @param {string[]} filePaths - A list of relative file paths.
 * @param {Object} config - Changed apps config.
 * @returns {Boolean} Whether apps of file paths have enabled continuous deployment.
 */
const isContinuousDeploymentEnabled = (filePaths, config) => {
  if (!filePaths.length) return false;

  for (const filePath of filePaths) {
    const allowedApps = getAllowedApps(filePath, config.apps);

    if (allowedApps.length) {
      const { continuousDeployment, rootPath } = allowedApps[0];
      const invalidDataType = !['boolean', 'undefined'].includes(
        typeof continuousDeployment,
      );

      if (invalidDataType) {
        throw new Error(
          `Invalid data type in 'continuousDeployment' field for ${rootPath}. Must be a boolean or omitted.`,
        );
      }

      // Apps in the config are opted in to continuous deployment by default.
      // `continuousDeployment` must be `false` to disable.
      if (continuousDeployment === false) return false;
    } else return false;
  }

  return true;
};

if (process.env.CHANGED_FILE_PATHS) {
  const changedFilePaths = process.env.CHANGED_FILE_PATHS.split(' ');

  const options = commandLineArgs([
    // Use the --output-type option to specify one of the following outputs:
    // 'entry': The entry names of the changed apps.
    // 'folder': The relative path of the changed apps root folders.
    // 'concurrency-group': The root folder names for deployment concurrency groups.
    // 'url': The root URLs of the changed apps.
    // 'slack-group': The Slack group of the app's team, specified in the config.
    { name: 'output-type', type: String, defaultValue: 'entry' },
    { name: 'delimiter', alias: 'd', type: String, defaultValue: ' ' },
    { name: 'continuous-deployment', type: Boolean, defaultValue: false },
  ]);

  if (options['continuous-deployment']) {
    const continuousDeploymentEnabled = isContinuousDeploymentEnabled(
      changedFilePaths,
      changedAppsConfig,
    );

    console.log(continuousDeploymentEnabled);
  } else {
    const changedAppsString = getChangedAppsString(
      changedFilePaths,
      changedAppsConfig,
      options['output-type'],
      options.delimiter,
    );

    console.log(changedAppsString);
  }
}

module.exports = {
  getChangedAppsString,
  isContinuousDeploymentEnabled,
};
