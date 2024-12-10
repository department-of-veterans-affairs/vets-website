const express = require('express');
const path = require('path');
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

router.post('/stop', async (req, res) => {
  const { port: portToStop } = req.body;

  // Validate port is a number and within allowed range
  // adds a bit of protection from invalid port numbers
  const port = parseInt(portToStop, 10);
  if (isNaN(port) || port < 1024 || port > 65535) {
    return res.status(400).json({
      success: false,
      message: 'Invalid port number. Must be between 1024 and 65535',
    });
  }

  // Only allow stopping known development ports
  // if 1337 is in the list, we are stopping the whole server manager aka this server
  const allowedPorts = [3000, 3001, 3002, 1337];
  if (!allowedPorts.includes(port)) {
    return res.status(403).json({
      success: false,
      message: 'Not allowed to stop processes on this port',
    });
  }

  try {
    await killProcessOnPort(port);
    return res.json({
      success: true,
      message: `Process on port ${port} stopped`,
    });
  } catch (error) {
    logger.error(`Error stopping process on port ${port}:`, error);
    return res.status(500).json({
      success: false,
      message: `Error stopping process on port ${port}: ${error.message}`,
    });
  }
});

const mockServerPaths = [
  'src/applications/_mock-form-ae-design-patterns/mocks/server.js',
  'src/applications/appeals/shared/tests/mock-api.js',
  'src/applications/avs/api/mocks/index.js',
  'src/applications/check-in/api/local-mock-api/index.js',
  'src/applications/combined-debt-portal/combined/utils/mocks/mockServer.js',
  'src/applications/disability-benefits/2346/mocks/index.js',
  'src/applications/disability-benefits/all-claims/local-dev-mock-api/index.js',
  'src/applications/education-letters/testing/response.js',
  'src/applications/financial-status-report/mocks/responses.js',
  'src/applications/health-care-supply-reordering/mocks/index.js',
  'src/applications/ivc-champva/10-10D/tests/e2e/fixtures/mocks/local-mock-responses.js',
  'src/applications/ivc-champva/10-7959C/tests/e2e/fixtures/mocks/local-mock-responses.js',
  'src/applications/ivc-champva/10-7959f-1/tests/e2e/fixtures/mocks/local-mock-responses.js',
  'src/applications/mhv-landing-page/mocks/api/index.js',
  'src/applications/mhv-medications/mocks/api/index.js',
  'src/applications/mhv-secure-messaging/api/mocks/index.js',
  'src/applications/mhv-supply-reordering/mocks/index.js',
  'src/applications/my-education-benefits/testing/responses.js',
  'src/applications/personalization/dashboard/mocks/server.js',
  'src/applications/personalization/notification-center/mocks/server.js',
  'src/applications/personalization/profile/mocks/server.js',
  'src/applications/personalization/review-information/tests/fixtures/mocks/local-mock-responses.js',
  'src/applications/post-911-gib-status/mocks/server.js',
  'src/applications/representative-appoint/mocks/server.js',
  'src/applications/simple-forms/20-10206/tests/e2e/fixtures/mocks/local-mock-responses.js',
  'src/applications/simple-forms/20-10207/tests/e2e/fixtures/mocks/local-mock-responses.js',
  'src/applications/simple-forms/21-0845/tests/e2e/fixtures/mocks/local-mock-responses.js',
  'src/applications/simple-forms/21-0966/tests/e2e/fixtures/mocks/local-mock-api-responses.js',
  'src/applications/simple-forms/21-0972/tests/e2e/fixtures/mocks/local-mock-responses.js',
  'src/applications/simple-forms/21-10210/tests/e2e/fixtures/mocks/local-mock-responses.js',
  'src/applications/simple-forms/21-4138/tests/e2e/fixtures/mocks/local-mock-responses.js',
  'src/applications/simple-forms/21-4142/tests/e2e/fixtures/mocks/local-mock-responses.js',
  'src/applications/simple-forms/40-0247/tests/e2e/fixtures/mocks/local-mock-api-reponses.js',
  'src/applications/simple-forms/form-upload/tests/e2e/fixtures/mocks/local-mock-responses.js',
  'src/applications/simple-forms/mock-simple-forms-patterns/tests/e2e/fixtures/mocks/local-mock-responses.js',
  'src/applications/travel-pay/services/mocks/index.js',
  'src/applications/vaos/services/mocks/index.js',
  'src/platform/mhv/api/mocks/index.js',
  'src/platform/mhv/downtime/mocks/api/index.js',
  'src/platform/testing/local-dev-mock-api/common.js',
];

router.post('/start-mock-server', async (req, res) => {
  const { responsesPath } = req.body;

  if (!responsesPath) {
    return res.status(400).json({
      success: false,
      message: 'responsesPath is required',
    });
  }

  // Normalize the path for comparison just in case there are any issues with the path string
  const normalizedPath = path.normalize(responsesPath).replace(/\\/g, '/');

  const matchingPathIndex = mockServerPaths.findIndex(
    allowedPath =>
      path.normalize(allowedPath).replace(/\\/g, '/') === normalizedPath,
  );

  if (matchingPathIndex === -1) {
    return res.status(403).json({
      success: false,
      message: 'Invalid responses path',
      allowedPaths: mockServerPaths, // I might remove this in the future
    });
  }

  // Use the validated path from our array
  // this way we are not using user input to start the server
  const validatedPath = path.join(
    paths.root,
    mockServerPaths[matchingPathIndex],
  );

  await killProcessOnPort('3000');

  const result = await startProcess(
    'mock-server',
    'node',
    [paths.mockApi, '--responses', validatedPath],
    {
      forceRestart: true,
    },
  );

  return res.json(result);
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
