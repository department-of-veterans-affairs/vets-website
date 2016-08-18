"use strict";  // eslint-disable-line

// Runs a simple mock JSON API server for use by e2e tests.
//
// Send a POST to the /mock with a JSON blob to configure server
// responses. The body can have the following keys:
//   verb -- The http verb being configured (default: get).
//   path -- String with the path name to script responses for.
//   value -- The mocked JSON response.
//
// The server does except and return a content type of application/json.
// Sending other request types will return a 500.
//
// The server also sets a CORS header of '*' as is normal for a public
// API server.

const bodyParser = require('body-parser');
const commandLineArgs = require('command-line-args');
const express = require('express');
const router = express.Router();
const winston = require('winston');

function mockApiRouter(options) {
  const mockResponses = {};

  router.post('/mock', (req, res) => {
    const verb = (req.body.verb || 'get').toLowerCase();
    mockResponses[verb] = mockResponses[verb] || {};
    mockResponses[verb][req.body.path] = req.body.value;
    const result = { result: `set ${verb} ${req.body.path} to ${req.body.value}` };
    options.logger.info(result);
    res.status(200).json(result);
  });

  router.all('/*', (req, res) => {
    const contentType = req.get('Content-Type');
    if (contentType !== 'application/json') {
      res.status(400).json({ error: `Expects application/json content-type. Got "${contentType}"` });
      return;
    }

    const verb = req.method.toLowerCase();
    const verbResponses = mockResponses[verb];
    let result = null;
    if (verbResponses) {
      result = verbResponses[req.path];
    }

    if (!result) {
      res.status(500);
      result = { error: `mock not initialized for ${verb} ${req.path}` };
    }
    options.logger.info(result);

    res.json(result);
  });

  return router;
}

const optionDefinitions = [
  { name: 'port', type: Number, defaultValue: 4000 },

  // Catch-all for bad arguments.
  { name: 'unexpected', type: String, multile: true, defaultOption: true },
];
const options = commandLineArgs(optionDefinitions);

if (options.unexpected && options.unexpected.length !== 0) {
    throw new Error(`Unexpected arguments: '${options.unexpected}'`);
}

options.logger = require('winston');

const app = express();

app.use(bodyParser.json());

// Enable CORS.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', mockApiRouter(options));

app.listen(options.port, () => {
  console.log(`Mock API server listening on port ${options.port}`);
});
