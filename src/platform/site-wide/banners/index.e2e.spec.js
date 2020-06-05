// Relative imports.
const E2eHelpers = require('platform/testing/e2e/helpers.js');

module.exports = E2eHelpers.createE2eTest(client => {
  client.openUrl(E2eHelpers.baseUrl);
  E2eHelpers.overrideSmoothScrolling(client);
});

module.exports['@disabled'] = true;
