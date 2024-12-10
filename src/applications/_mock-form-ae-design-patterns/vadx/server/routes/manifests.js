const express = require('express');
const { cachedManifests } = require('../utils/manifests');

const router = express.Router();

router.get('/manifests', (req, res) => {
  res.json({
    success: true,
    count: cachedManifests.length,
    manifests: cachedManifests,
  });
});

module.exports = router;
