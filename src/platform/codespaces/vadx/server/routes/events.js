const express = require('express');
const { outputCache, clients, sendSSE } = require('../utils/processes');

const router = express.Router();

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

module.exports = router;
