const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { killProcessOnPort } = require('./utils');
const {
  processes,
  startProcess,
  outputCache,
  clients,
  sendSSE,
} = require('./processes');
const { getManifests, findManifestFiles } = require('./manifests');
const logger = require('./utils/logger');
const paths = require('./utils/paths');

const router = express.Router();

router.post('/start', (req, res) => {
  const { name, command, args, env } = req.body;
  const result = startProcess(name, command, args, env);
  res.json(result);
});

router.get('/status', (req, res) => {
  const status = Object.keys(processes).reduce((acc, name) => {
    acc[name] = {
      pid: processes[name].pid,
      killed: processes[name].killed,
      exitCode: processes[name].exitCode,
      signalCode: processes[name].signalCode,
      args: processes[name].spawnargs,
    };
    return acc;
  }, {});
  res.json(status);
});

router.post('/update-toggles-file', async (req, res) => {
  const { updateToggle } = req.body;
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'mocks',
    'endpoints',
    'feature-toggles',
    'index.js',
  );

  try {
    // Read the current file content
    let content = await fs.readFile(filePath, 'utf8');

    // Update the content
    const newDate = new Date().toISOString();
    content = content.replace(/updated: .*,/, `updated: '${newDate}',`);

    if (updateToggle) {
      content += '\n// File updated via API';
    }

    // Write the updated content back to the file
    await fs.writeFile(filePath, content, 'utf8');

    res.json({
      success: true,
      message: 'File updated successfully',
      updatedAt: newDate,
    });
  } catch (error) {
    logger.error('Error updating file:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating file',
      error: error.message,
    });
  }
});

router.post('/stop', async (req, res) => {
  const { port: portToStop } = req.body;
  try {
    await killProcessOnPort(portToStop);
    res.json({
      success: true,
      message: `Process on port ${portToStop} stopped`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error stopping process on port ${portToStop}: ${error.message}`,
    });
  }
});

router.post('/start-fe-dev-server', (req, res) => {
  const { entry, api } = req.body;
  const name = 'fe-dev-server';
  const command = 'yarn';
  const args = [
    '--cwd',
    paths.root,
    'watch',
    '--env',
    `entry=${entry}`,
    `api=${api}`,
  ];

  const result = startProcess(name, command, args);
  res.json(result);
});

router.post('/start-mock-server', (req, res) => {
  // get path to root of the repo
  const root = path.resolve(__dirname, '..', '..', '..');
  logger.debug({ root });
  const { debug = true, responsesPath } = req.body;
  const name = 'mock-server';
  const command = 'node';
  const args = [
    'src/platform/testing/e2e/mockapi.js',
    '--responses',
    responsesPath,
  ];
  const env = { AEDEBUG: debug.toString() };

  const result = startProcess(name, command, args, env);
  res.json(result);
});

router.get('/output/:name', (req, res) => {
  const { name } = req.params;
  if (outputCache[name]) {
    res.json(outputCache[name]);
  } else {
    res
      .status(404)
      .json({ error: `No output cache found for process ${name}` });
  }
});

router.get('/events/:name', (req, res) => {
  const { name } = req.params;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Send the current cache immediately
  if (outputCache[name]) {
    sendSSE(res, { type: 'cache', data: outputCache[name] });
  }

  // Add this client to the list of clients for this process
  if (!clients.has(name)) {
    clients.set(name, []);
  }
  clients.get(name).push(res);

  // Remove the client when the connection is closed
  req.on('close', () => {
    const clientsForProcess = clients.get(name) || [];
    const index = clientsForProcess.indexOf(res);
    if (index !== -1) {
      clientsForProcess.splice(index, 1);
    }
  });
});

router.get('/manifests', getManifests);

router.post('/start-fe', async (req, res) => {
  const { entries = [] } = req.body;

  logger.debug('Entries:', entries);

  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body must include an array of entry strings',
    });
  }

  try {
    const manifests = await findManifestFiles(paths.applications);
    logger.debug('Found manifests count:', manifests.length);

    // Get available entry names from manifests
    const availableEntries = manifests
      .map(manifest => manifest.entryName)
      .filter(Boolean);
    logger.debug('Available entries:', availableEntries);

    // Validate all entries exist in manifests
    const invalidEntries = entries.filter(
      entry => !availableEntries.includes(entry),
    );

    if (invalidEntries.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid entry names provided',
        invalidEntries,
        availableEntries,
      });
    }

    const result = startProcess('fe-dev-server', 'yarn', [
      '--cwd',
      paths.root,
      'watch',
      '--env',
      `entry=${entries.join(',')}`,
      'api=http://localhost:3000',
    ]);

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
