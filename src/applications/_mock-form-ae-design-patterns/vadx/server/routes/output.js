const express = require('express');
const { outputCache } = require('../utils/processes');

const router = express.Router();

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

router.get('/output', (req, res) => {
  res.json({ all: outputCache });
});

module.exports = router;
