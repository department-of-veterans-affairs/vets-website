const express = require('express');
const { getCachedManifests } = require('../utils/manifests');

const router = express.Router();

router.get('/manifests', (req, res) => {
  const manifests = getCachedManifests();
  res.json({
    success: true,
    count: manifests.length,
    manifests,
  });
});

module.exports = router;
