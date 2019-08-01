"use strict"; // eslint-disable-line

// const commandLineArgs = require('command-line-args');
const express = require('express');
const fallback = require('express-history-api-fallback');
const morgan = require('morgan');
const path = require('path');
const createTestCafe = require('testcafe');

const appSettings = require('../config/parse-app-settings');
const ENVIRONMENTS = require('../src/site/constants/environments');

/* eslint-disable no-console */

// Simple test server to serve up the build files.

// This is used over a bare http-server invocation because it handles paths
// inside React apps using the expression-history-api-fallback option.
const startServer = (
  buildtype = ENVIRONMENTS.VAGOVDEV,
  host = 'localhost',
  port = 3333,
) => {
  const app = express();

  const root = path.resolve(__dirname, `../build/${buildtype}`);

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

(async () => {
  let server;
  let testcafe;

  try {
    server = startServer(ENVIRONMENTS.VAGOVPROD, 'localhost', 3001);
    testcafe = await createTestCafe();
    const runner = testcafe.createRunner();

    const failedCount = await runner
      .src(['src/**/*.testcafe.e2e.spec.js'])
      .browsers(['chrome'])
      .run();

    console.log(`Tests failed: ${failedCount}`);
  } catch (e) {
    console.log(`Error caught: ${e}`);
  } finally {
    if (server) server.close();
    if (testcafe) testcafe.close();
  }
})();

/* eslint-enable no-console */
