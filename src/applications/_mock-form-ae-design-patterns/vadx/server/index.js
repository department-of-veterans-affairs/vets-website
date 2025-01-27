/* eslint-disable no-console */
const express = require('express');

const cors = require('./utils/cors');
const { initializeManifests } = require('./utils/manifests');
const { autoStartServers } = require('./utils/processes');
const parseArgs = require('./utils/parseArgs');

const app = express();
const port = 1337;
const args = parseArgs();

app.use(express.json());

// Allow CORS
app.use(cors);

const router = express.Router();

router.use(require('./routes/events'));
router.use(require('./routes/manifests'));
router.use(require('./routes/output'));
router.use(require('./routes/start-mock-server'));
router.use(require('./routes/start-frontend-server'));
router.use(require('./routes/status'));
router.use(require('./routes/stop-on-port'));

app.use(router);

app.listen(port, async () => {
  await initializeManifests();
  await autoStartServers(args);
  console.log(`Process manager server listening at http://localhost:${port}`);
});
