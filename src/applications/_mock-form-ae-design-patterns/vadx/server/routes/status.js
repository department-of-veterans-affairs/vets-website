// server/routes/status.js
const express = require('express');
const { processes } = require('../utils/processes');
const { getCachedManifests } = require('../utils/manifests');
const logger = require('../utils/logger');

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
 * Gets route information from manifests for given entry names
 * @param {string[]} entryNames - Array of entry names to look up
 * @returns {Object[]} Array of route information objects
 */
const getRouteInfo = async entryNames => {
  const routes = [];
  const manifestFiles = getCachedManifests();

  entryNames.forEach(entryName => {
    const manifest = manifestFiles.find(m => m.entryName === entryName);
    if (manifest) {
      routes.push({
        entryName,
        rootUrl: manifest.rootUrl,
        appName: manifest.appName || '',
      });
    }
  });

  return routes;
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
    let routes = [];
    if (processStatus['fe-dev-server']) {
      const entryNames = getEntryNamesFromArgs(
        processStatus['fe-dev-server'].args,
      );
      routes = await getRouteInfo(entryNames);
    }

    res.json({
      processes: processStatus,
      routes,
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
