const commandLineArgs = require('command-line-args');

const ENVIRONMENTS = require('../src/site/constants/environments');
const testServer = require('../src/platform/testing/e2e/test-server');

const optionDefinitions = [
  { name: 'buildtype', type: String, defaultValue: ENVIRONMENTS.VAGOVDEV },
  { name: 'port', type: Number, defaultValue: +(process.env.WEB_PORT || 3333) },
  { name: 'host', type: String, defaultValue: 'localhost' },

  // Catch-all for bad arguments.
  { name: 'unexpected', type: String, multile: true, defaultOption: true },
];
const options = commandLineArgs(optionDefinitions);

if (options.unexpected && options.unexpected.length !== 0) {
  throw new Error(`Unexpected arguments: '${options.unexpected}'`);
}

testServer(options.buildType, options.host, options.port);
