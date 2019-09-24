const Header = require('./megamenu');
const E2eHelpers = require('../helpers');
// const Timeouts = require('../../testing/e2e/timeouts');

module.exports = E2eHelpers.createE2eTest(client => {
  Header.testDataDrivenHeader(client, '/');
  client.end();
});
