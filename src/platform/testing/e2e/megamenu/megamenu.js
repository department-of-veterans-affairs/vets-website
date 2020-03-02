const E2eHelpers = require('../helpers');
const Timeouts = require('../timeouts');

function testDataDrivenMegamenu(client, path) {
  const appURL = `${E2eHelpers.baseUrl}${path}`;

  client.openUrl(appURL).waitForElementVisible('body', Timeouts.normal);

  client
    .waitForElementVisible('#vetnav-menu', Timeouts.normal)
    .axeCheck('#vetnav-menu');
}

module.exports = {
  testDataDrivenMegamenu,
};
