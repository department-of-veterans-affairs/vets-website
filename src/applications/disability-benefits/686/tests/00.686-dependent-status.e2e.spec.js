const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts.js');
const manifest = require('../manifest.json');

module.exports = E2eHelpers.createE2eTest(client => {
  client
    .openUrl(`${E2eHelpers.baseUrl}${manifest.rootUrl}`)
    .waitForElementVisible('body', Timeouts.normal)
    .axeCheck('.main');

  client.end();
});

module.exports['@disabled'] =
  manifest.template[process.env.BUILDTYPE] === false;
