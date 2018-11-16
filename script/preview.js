'use strict'; // eslint-disable-line

// Simple test server to serve up the build files.

// This is used over a bear http-server invocation because it handles paths inside React apps
// using the expression-history-api-fallback option.

const commandLineArgs = require('command-line-args');
const path = require('path');
const express = require('express');
const buildPreview = require('./preview-build');

const ENVIRONMENTS = require('./constants/environments');
const HOSTNAMES = require('./constants/hostnames');

const defaultBuildtype = ENVIRONMENTS.LOCALHOST;
const defaultHost = HOSTNAMES[defaultBuildtype];
const defaultContentDir = '../../vagov-content/pages';

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'buildtype', type: String, defaultValue: defaultBuildtype },
  { name: 'host', type: String, defaultValue: defaultHost },
  { name: 'port', type: Number, defaultValue: 3001 },
  { name: 'watch', type: Boolean, defaultValue: false },
  { name: 'entry', type: String, defaultValue: null },
  { name: 'analyzer', type: Boolean, defaultValue: false },
  { name: 'protocol', type: String, defaultValue: 'http' },
  { name: 'public', type: String, defaultValue: null },
  { name: 'destination', type: String, defaultValue: null },
  { name: 'content-deployment', type: Boolean, defaultValue: false },
  { name: 'content-directory', type: String, defaultValue: defaultContentDir },
  { name: 'unexpected', type: String, multile: true, defaultOption: true },
];

const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);

if (options.unexpected && options.unexpected.length !== 0) {
  throw new Error(`Unexpected arguments: '${options.unexpected}'`);
}

const app = express();

const root = path.resolve(__dirname, `../build/${options.buildtype}`);
app.use(express.static(root));

app.use('/content', (req, res) => {
  buildPreview('index.md', options, html => {
    res.set('Content-Type', 'text/html');
    res.send(html);
  });
});

app.listen(options.port, options.host, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Test server listening on port ${options.port} for type ${
      options.buildtype
    }`,
  );
});
