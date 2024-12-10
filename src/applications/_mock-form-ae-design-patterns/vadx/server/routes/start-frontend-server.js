const express = require('express');
const { killProcessOnPort } = require('../utils/utils');
const { startProcess } = require('../utils/processes');
const paths = require('../utils/paths');
const logger = require('../utils/logger');
const { findManifestFiles } = require('../utils/manifests');

const router = express.Router();

router.post('/start-frontend-server', async (req, res) => {
  const { entries = [] } = req.body;

  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body must include an array of entry strings',
    });
  }

  try {
    const manifests = await findManifestFiles(paths.applications);
    logger.debug('Found manifests count:', manifests.length);

    // Find manifests that match the requested entries
    const validManifests = entries
      .map(entry => manifests.find(manifest => manifest.entryName === entry))
      .filter(Boolean);

    logger.debug('Valid manifests:', validManifests);

    // check if we found all requested entries
    if (validManifests.length !== entries.length) {
      const foundEntries = validManifests.map(m => m.entryName);
      const invalidEntries = entries.filter(
        entry => !foundEntries.includes(entry),
      );

      // provides the invalid entries and the available entries
      // might remove the available entries in the future just to be more consistent
      // but this way we can provide the user with the available entries
      return res.status(400).json({
        success: false,
        message: 'Invalid entry names provided',
        invalidEntries,
        availableEntries: manifests.map(m => m.entryName).filter(Boolean),
      });
    }

    // Use only the validated entry names from the manifests
    // this way user input is not used to start the server
    const validatedEntries = validManifests.map(m => m.entryName);

    await killProcessOnPort('3001');

    const result = await startProcess(
      'fe-dev-server',
      'yarn',
      [
        '--cwd',
        paths.root,
        'watch',
        '--env',
        `entry=${validatedEntries.join(',')}`,
        'api=http://localhost:3000',
      ],
      {
        forceRestart: true,
      },
    );

    return res.json(result);
  } catch (error) {
    logger.error('Error in /start-fe:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to validate entries',
      error: error.message,
    });
  }
});

module.exports = router;
