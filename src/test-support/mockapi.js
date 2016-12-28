"use strict";  // eslint-disable-line

// Simple mock api server. Allows scripting of a JSON API endpoint for end-to-end tests.
//
// Set the behavior by posting to /mock with a JSON body of
//    verb: The http verb to mock (defaults to 'get')
//    path: /my/api/path
//   value: { "some": "json", "blob": "yay." }

const bodyParser = require('body-parser');
const commandLineArgs = require('command-line-args');
const cors = require('cors');
const express = require('express');
const winston = require('winston');

const optionDefinitions = [
  { name: 'buildtype', type: String, defaultValue: 'development' },
  { name: 'port', type: Number, defaultValue: +(process.env.API_PORT || 4000) },

  // Catch-all for bad arguments.
  { name: 'unexpected', type: String, multile: true, defaultOption: true },
];
const options = commandLineArgs(optionDefinitions);

if (options.unexpected && options.unexpected.length !== 0) {
  throw new Error(`Unexpected arguments: '${options.unexpected}'`);
}

function makeMockApiRouter(opts) {
  const mockResponses = {};

  const router = express.Router(); // eslint-disable-line new-cap
  router.post('/mock', (req, res) => {
    const verb = (req.body.verb || 'get').toLowerCase();
    mockResponses[verb] = mockResponses[verb] || {};
    mockResponses[verb][req.body.path] = req.body.value;
    const result = { result: `set ${verb} ${req.body.path} to ${JSON.stringify(req.body.value)}` };
    opts.logger.info(result);
    res.status(200).json(result);
  });

  // Handle CORS preflight.
  router.options('*', cors());

  router.all('*', cors(), (req, res) => {
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
    opts.logger.info(result);
    res.json(result);
  });

  return router;
}

options.logger = winston;

const app = express();
app.use(bodyParser.json());
app.use(makeMockApiRouter(options));
app.listen(options.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock API server listening on port ${options.port}`);
});
