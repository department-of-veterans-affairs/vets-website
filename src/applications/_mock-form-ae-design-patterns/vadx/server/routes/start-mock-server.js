const express = require('express');
const path = require('path');
const { killProcessOnPort, startProcess } = require('../utils/processes');
const paths = require('../utils/paths');
const { MOCK_SERVER_PATHS } = require('../constants/mockServerPaths');
const { MOCK_SERVER_PROCESS_NAME } = require('../../constants');

const router = express.Router();

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

  const matchingPathIndex = MOCK_SERVER_PATHS.findIndex(
    allowedPath =>
      path.normalize(allowedPath).replace(/\\/g, '/') === normalizedPath,
  );

  if (matchingPathIndex === -1) {
    return res.status(403).json({
      success: false,
      message: 'Invalid responses path',
      allowedPaths: MOCK_SERVER_PATHS, // I might remove this in the future
    });
  }

  // Use the validated path from our array
  // this way we are not using user input to start the server
  const validatedPath = path.join(
    paths.root,
    MOCK_SERVER_PATHS[matchingPathIndex],
  );

  await killProcessOnPort('3000');

  const result = await startProcess(
    MOCK_SERVER_PROCESS_NAME,
    'node',
    [paths.mockApi, '--responses', validatedPath],
    {
      forceRestart: true,
    },
  );

  return res.json(result);
});

module.exports = router;
