/* eslint-disable no-console */
const express = require('express');

const cors = require('./cors');
const { initializeManifests } = require('./manifests');
const { autoStartServers } = require('./processes');
const routes = require('./routes');
const parseArgs = require('./utils/parseArgs');

const app = express();
const port = 1337;
const args = parseArgs();

app.use(express.json());
// Allow CORS with pretty open settings
app.use(cors);

app.use(routes);

app.listen(port, async () => {
  await initializeManifests();
  await autoStartServers(args);
  console.log(`Process manager server listening at http://localhost:${port}`);
});
