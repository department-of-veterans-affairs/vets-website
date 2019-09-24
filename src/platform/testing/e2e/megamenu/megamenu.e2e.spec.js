const Megamenu = require('./megamenu');
const E2eHelpers = require('../helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  Megamenu.testDataDrivenMegamenu(client, '/');
  client.end();
});
