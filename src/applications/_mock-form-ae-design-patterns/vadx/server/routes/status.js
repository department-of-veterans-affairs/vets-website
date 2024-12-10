const express = require('express');
const { processes } = require('../utils/processes');

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

module.exports = router;
