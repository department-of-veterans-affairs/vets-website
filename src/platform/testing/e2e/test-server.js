"use strict";  // eslint-disable-line

// Simple test server to serve up the build files.

// This is used over a bear http-server invocation because it handles paths inside React apps
// using the expression-history-api-fallback option.

const fs = require('fs');
const commandLineArgs = require('command-line-args');
const express = require('express');
const fallback = require('express-history-api-fallback');
const path = require('path');
const morgan = require('morgan');
const appSettings = require('../../../../config/parse-app-settings');

const optionDefinitions = [
  { name: 'buildtype', type: String, defaultValue: 'development' },
  { name: 'port', type: Number, defaultValue: +(process.env.WEB_PORT || 3333) },
  { name: 'host', type: String, defaultValue: 'localhost' },

  // Catch-all for bad arguments.
  { name: 'unexpected', type: String, multile: true, defaultOption: true },
];
const options = commandLineArgs(optionDefinitions);

if (options.unexpected && options.unexpected.length !== 0) {
  throw new Error(`Unexpected arguments: '${options.unexpected}'`);
}

const app = express();

let root = path.resolve(__dirname, `../../../../build/${options.buildtype}`);
if (!fs.existsSync(root)) {
  // if there isn't a build directory here, then check the parent directory.
  // This is a temporary adapation as we transition to vagov-content.
  root = path.resolve(__dirname, `../../../../../build/${options.buildtype}`);
}

appSettings.parseFromBuildDir(root);
const routes = appSettings.getAllApplicationRoutes();

app.use(
  morgan('combined', {
    skip: (req, _res) => req.path.match(/(css|js|gif|jpg|png|svg)$/),
  }),
);
app.use(express.static(root));
routes.forEach(url => {
  app.use(url, fallback(`${url}/index.html`, { root }));
});

app.listen(options.port, options.host, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Test server listening on port ${options.port} for type ${
      options.buildtype
    }`,
  );
});
