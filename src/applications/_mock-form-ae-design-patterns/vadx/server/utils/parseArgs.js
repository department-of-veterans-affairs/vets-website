const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'entry', type: String, defaultValue: 'mock-form-ae-design-patterns' },
  { name: 'api', type: String, defaultValue: 'http://localhost:3000' },
  { name: 'responses', type: String },
];

function parseArgs() {
  const options = commandLineArgs(optionDefinitions);
  return {
    entry: options.entry,
    api: options.api,
    responses:
      options.responses ||
      `src/applications/_mock-form-ae-design-patterns/mocks/server.js`,
  };
}

module.exports = parseArgs;
