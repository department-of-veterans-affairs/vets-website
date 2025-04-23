// server/routes/status.js
const express = require('express');
const { processes } = require('../utils/processes');
const { getCachedManifests } = require('../utils/manifests');
const logger = require('../utils/logger');
const { FRONTEND_PROCESS_NAME } = require('../../constants');

const router = express.Router();

/**
 * Extracts entry names from frontend process args
 * @param {string[]} args - Process spawn arguments
 * @returns {string[]} Array of entry names
 */
const getEntryNamesFromArgs = args => {
  const entryArg = args.find(arg => arg.startsWith('entry='));
  if (!entryArg) return [];

  // Split on comma to handle multiple entries
  return entryArg.replace('entry=', '').split(',');
};

/**
 * Gets app information from manifests for given entry names
 * @param {string[]} entryNames - Array of entry names to look up
 * @returns {Object[]} Array of app information objects
 */
const getAppInfo = async entryNames => {
  const apps = [];
  const manifestFiles = getCachedManifests();

  entryNames.forEach(entryName => {
    const manifest = manifestFiles.find(m => m.entryName === entryName);
    if (manifest) {
      apps.push({
        entryName,
        rootUrl: manifest.rootUrl,
        appName: manifest.appName || '',
      });
    }
  });

  return apps;
};

router.get('/status', async (req, res) => {
  try {
    // Get basic process status info
    const processStatus = Object.keys(processes).reduce((acc, name) => {
      acc[name] = {
        pid: processes[name].pid,
        killed: processes[name].killed,
        exitCode: processes[name].exitCode,
        signalCode: processes[name].signalCode,
        args: processes[name].spawnargs,
      };
      return acc;
    }, {});

    // Get route information for frontend process if running
    let apps = [];
    if (processStatus[FRONTEND_PROCESS_NAME]) {
      const entryNames = getEntryNamesFromArgs(
        processStatus[FRONTEND_PROCESS_NAME].args,
      );
      apps = await getAppInfo(entryNames);
    }

    res.json({
      processes: processStatus,
      apps,
    });
  } catch (error) {
    logger.error('Error getting status:', error);
    res.status(500).json({
      error: 'Failed to get server status',
      message: error.message,
    });
  }
});

module.exports = router;
