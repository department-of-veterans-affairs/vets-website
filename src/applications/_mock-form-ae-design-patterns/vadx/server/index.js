/* eslint-disable no-console */
const express = require('express');

const cors = require('./cors');
const { killProcessOnPort } = require('./utils');
const { initializeManifests } = require('./manifests');
const { autoStartServers } = require('./processes');
const routes = require('./routes');

const app = express();
const port = 1337;

app.use(express.json());
// Allow CORS with pretty open settings
app.use(cors);

app.use(routes);

app.listen(port, async () => {
  await initializeManifests();
  console.log(`Process manager server listening at http://localhost:${port}`);
  killProcessOnPort('3000');
  killProcessOnPort('3001');
  autoStartServers();
});
