// Re-export server and rest from mocha-setup for backward compatibility
// The global server is already started by mocha-setup.js
const { server, rest } = require('platform/testing/unit/mocha-setup');

module.exports = {
  server,
  rest,
};
