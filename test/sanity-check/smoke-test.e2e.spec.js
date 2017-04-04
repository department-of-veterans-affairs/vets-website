// TODO(awong): Convert to ES6

// TODO(awong): Move all this into ES6 syntax.
const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    // Ensure introduction page renders.
    client
      .url(E2eHelpers.baseUrl)
      .waitForElementVisible('body', Timeouts.normal);

    client.end();
  });

