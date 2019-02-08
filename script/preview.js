const commandLineArgs = require('command-line-args');
const path = require('path');
const express = require('express');
const createPipieline = require('../src/site/stages/preview');

const getDrupalClient = require('../src/site/stages/build/drupal/api');
const ENVIRONMENTS = require('../src/site/constants/environments');
const HOSTNAMES = require('../src/site/constants/hostnames');

const defaultBuildtype = ENVIRONMENTS.LOCALHOST;
const defaultHost = HOSTNAMES[defaultBuildtype];
const defaultContentDir = '../../../../../vagov-content/pages';

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  {
    name: 'buildtype',
    type: String,
    defaultValue: process.env.PREVIEW_BUILD_TYPE || defaultBuildtype,
  },
  { name: 'buildpath', type: String, defaultValue: 'build/localhost' },
  { name: 'host', type: String, defaultValue: defaultHost },
  { name: 'port', type: Number, defaultValue: process.env.PORT || 3001 },
  { name: 'entry', type: String, defaultValue: null },
  { name: 'protocol', type: String, defaultValue: 'http' },
  { name: 'destination', type: String, defaultValue: null },
  { name: 'content-directory', type: String, defaultValue: defaultContentDir },
  { name: 'unexpected', type: String, multile: true, defaultOption: true },
];

const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);

if (options.unexpected && options.unexpected.length !== 0) {
  throw new Error(`Unexpected arguments: '${options.unexpected}'`);
}

const app = express();
const drupalClient = getDrupalClient(options);

app.use(express.static(path.join(__dirname, '..', options.buildpath)));

app.get('/health', (req, res) => {
  res.send(200);
});

app.get('/preview', async (req, res) => {
  const smith = createPipieline({
    ...options,
    port: process.env.PORT,
  });

  const drupalData = await drupalClient.getLatestPageById(req.query.nodeId);

  if (!drupalData.data.nodes.entities.length) {
    res.sendStatus(404);
    return;
  }

  const drupalPage = drupalData.data.nodes.entities[0];

  const files = {
    [`${req.path.substring(1)}/index.html`]: {
      ...drupalPage,
      isPreview: true,
      drupalSite: drupalClient.getSiteUri(),
      layout: `${drupalPage.entityBundle}.drupal.liquid`,
      contents: Buffer.from('<!-- Drupal-provided data -->'),
      debug: JSON.stringify(drupalPage, null, 4),
    },
  };

  smith.run(files, (err, newFiles) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      res.sendStatus(500);
    } else {
      res.set('Content-Type', 'text/html');
      res.send(Object.entries(newFiles)[0][1].contents);
    }
  });
});

app.listen(options.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Content preview server running on port ${options.port}`);
});
