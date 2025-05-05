// Simple test server to serve up the build files.

// This is used over a vanilla http-server because it handles paths
// inside React apps using the express-history-api-fallback option.

const commandLineArgs = require('command-line-args');
const express = require('express');
const fallback = require('express-history-api-fallback');
const morgan = require('morgan');
const path = require('path');

const manifestHelpers = require('../../../../config/manifest-helpers');
const ENVIRONMENTS = require('../../../site/constants/environments');

const optionDefinitions = [
  { name: 'buildtype', type: String, defaultValue: ENVIRONMENTS.VAGOVDEV },
  { name: 'port', type: Number, defaultValue: +(process.env.WEB_PORT || 3333) },
  { name: 'host', type: String, defaultValue: 'localhost' },
];

const options = commandLineArgs(optionDefinitions);
const root = path.resolve(__dirname, `../../../../build/${options.buildtype}`);
const routes = manifestHelpers.getAppRoutes();

const app = express();

app.use(
  morgan('combined', {
    skip: (req, _res) => req.path.match(/(css|js|gif|jpg|png|svg)$/),
  }),
);

app.use(express.static(root));

// Sort by descending path length to give precedence to deeper root URLs.
// For example, '/foo/bar/baz' should match '/foo/bar' instead of '/foo'
// because '/foo/bar' is a deeper and more specific path than '/foo'.
routes.sort((a, b) => b.length - a.length);
routes.forEach(url => {
  app.use(url, fallback(`${url}/index.html`, { root }));
});
app.listen(options.port, options.host, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Test server listening on port ${options.host}:${options.port} for type ${options.buildtype}`,
  );
});
