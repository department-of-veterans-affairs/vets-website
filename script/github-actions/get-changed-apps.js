/* eslint-disable no-console */
const fs = require('fs');
const find = require('find');
const path = require('path');
const commandLineArgs = require('command-line-args');

// Ensure Node.js resolves modules from the project root
process.env.NODE_PATH = path.join(__dirname, '../../node_modules');
require('module').Module._initPaths();

const changedAppsConfig = require('../../config/changed-apps-build.json');

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

  return find
    .fileSync(/manifest\.(json|js)$/, fullAppPath)
    .map(file => JSON.parse(fs.readFileSync(file)));
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
    const { slackGroup, continuousDeployment } = allowedApp;
    return manifests.map(({ entryName, rootUrl }) => ({
      entryName,
      rootUrl,
      rootPath: path.join(appsDirectory, rootAppFolderName),
      slackGroup,
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
        } else if (outputType === 'slack-group') {
          if (app.slackGroup) appStrings.push(app.slackGroup);
        } else if (outputType === 'url') {
          if (app.rootUrl) appStrings.push(app.rootUrl);
        } else throw new Error('Invalid output type specified.');
      });
    } else return '';
  }

  return [...new Set(appStrings)].join(delimiter);
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

/**
 * Splits an array into chunks of a specified size.
 *
 * @param {Array} array - The array to split.
 * @param {number} size - The maximum size of each chunk.
 * @returns {Array[]} An array of chunks.
 */
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const options = commandLineArgs([
  // Use the --output-type option to specify one of the following outputs:
  // 'entry': The entry names of the changed apps.
  // 'folder': The relative path of the changed apps root folders.
  // 'url': The root URLs of the changed apps.
  // 'slack-group': The Slack group of the app's team, specified in the config.
  { name: 'output-type', type: String, defaultValue: 'entry' },
  { name: 'delimiter', alias: 'd', type: String, defaultValue: ' ' },
  { name: 'continuous-deployment', type: Boolean, defaultValue: false },
  { name: 'file', type: String, defaultValue: null },
]);

let changedFilePaths = [];
if (options.file) {
  const fileContent = fs.readFileSync(options.file, 'utf8');
  changedFilePaths = fileContent.split('\n').filter(Boolean);
} else if (process.env.CHANGED_FILE_PATHS) {
  changedFilePaths = process.env.CHANGED_FILE_PATHS.split(' ');
}

if (changedFilePaths.length) {
  const CHUNK_SIZE = 100; // Adjust chunk size as needed to avoid argument length issues
  const filePathChunks = chunkArray(changedFilePaths, CHUNK_SIZE);

  if (options['continuous-deployment']) {
    let continuousDeploymentEnabled = true;

    for (const chunk of filePathChunks) {
      if (!isContinuousDeploymentEnabled(chunk, changedAppsConfig)) {
        continuousDeploymentEnabled = false;
        break;
      }
    }

    console.log(continuousDeploymentEnabled);
  } else {
    const appStrings = [];

    for (const chunk of filePathChunks) {
      const chunkAppString = getChangedAppsString(
        chunk,
        changedAppsConfig,
        options['output-type'],
        options.delimiter,
      );
      if (chunkAppString) {
        appStrings.push(chunkAppString);
      }
    }

    console.log(appStrings.join(options.delimiter));
  }
}

module.exports = {
  getChangedAppsString,
  isContinuousDeploymentEnabled,
};
