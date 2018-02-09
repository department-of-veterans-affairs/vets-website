"use strict";  // eslint-disable-line

// Simple test server to serve up the build files.

// This is used over a bear http-server invocation because it handles paths inside React apps
// using the expression-history-api-fallback option.

const commandLineArgs = require('command-line-args');
const express = require('express');
const fallback = require('express-history-api-fallback');
const path = require('path');
const morgan = require('morgan');

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

const root = path.resolve(__dirname, `../../build/${options.buildtype}`);
app.use(morgan('combined', { skip: (req, _res) => { return req.path.match(/(css|js|gif|jpg|png|svg)$/); } }));
app.use(express.static(root));
app.use('/health-care/apply/application', fallback('/health-care/apply/application/index.html', { root }));
app.use('/rx', fallback('index.html', { root }));
app.use('/health-care/messaging', fallback('/health-care/messaging/index.html', { root }));
app.use('/health-care/prescriptions', fallback('/health-care/prescriptions/index.html', { root }));
app.use('/education/apply-for-education-benefits/application', fallback('/education/apply-for-education-benefits/application/index.html', { root }));
app.use('/burials-and-memorials/pre-need/form-10007-apply-for-eligibility', fallback('/burials-and-memorials/pre-need/form-10007-apply-for-eligibility.html', { root }));

app.listen(options.port, options.host, () => {
  // eslint-disable-next-line no-console
  console.log(`Test server listening on port ${options.port} for type ${options.buildtype}`);
});
