"use strict";  // eslint-disable-line

// Simple test server to serve up the build files.

// This is used over a bare http-server invocation because it handles paths
// inside React apps using the expression-history-api-fallback option.

const express = require('express');
const fallback = require('express-history-api-fallback');
const path = require('path');
const morgan = require('morgan');

const appSettings = require('../../../../config/parse-app-settings');
const ENVIRONMENTS = require('../../../site/constants/environments');

/* eslint-disable no-console */

const testServer = (
  buildtype = ENVIRONMENTS.VAGOVDEV,
  host = 'localhost',
  port = 3333,
) => {
  const app = express();

  const root = path.resolve(__dirname, `../../../../build/${buildtype}`);

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

  return app.listen(port, host, () => {
    console.log(`Test server listening on port ${port} for type ${buildtype}`);
  });
};

/* eslint-enable no-console */

module.exports = testServer;
