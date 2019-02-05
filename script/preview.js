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
  { name: 'buildtype', type: String, defaultValue: defaultBuildtype },
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

app.use(
  '/generated',
  express.static(path.join(__dirname, '..', options.buildpath, 'generated')),
);
app.use(
  '/img',
  express.static(path.join(__dirname, '..', options.buildpath, 'img')),
);
app.use(
  '/js',
  express.static(path.join(__dirname, '..', options.buildpath, 'js')),
);
app.use(
  '/fonts',
  express.static(path.join(__dirname, '..', options.buildpath, 'fonts')),
);

app.use(async (req, res, next) => {
  const smith = createPipieline({
    ...options,
    port: process.env.PORT,
  });

  const drupalData = await drupalClient.getPageById(req.path).data;

  if (!drupalData || !drupalData.route) {
    // Once we have Metalsmith templating in place for Drupal data, we should
    // use that instead of the GH data.
    next();
    return;
  }

  const drupalPage = drupalData.route.entity;

  const files = {
    [`${req.path.substring(1)}/index.html`]: {
      ...drupalPage,
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
    }
    res.set('Content-Type', 'text/html');
    // This will actually need to convert a md path to an html path, probably
    res.send(Object.entries(newFiles)[0][1].contents);
  });
});

app.use(express.static(path.join(__dirname, '..', options.buildpath)));

app.listen(options.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Content preview server running on port ${options.port}`);
});
