const express = require('express');
const { killProcessOnPort } = require('../utils/processes');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/stop', async (req, res) => {
  const { port: portToStop } = req.body;

  // Validate port is a number and within allowed range
  // adds a bit of protection from invalid port numbers
  const port = parseInt(portToStop, 10);
  if (Number.isNaN(port) || port < 1024 || port > 65535) {
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

module.exports = router;
