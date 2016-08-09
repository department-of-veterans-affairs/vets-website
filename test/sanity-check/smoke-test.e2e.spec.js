// TODO(awong): Convert to ES6

// TODO(awong): Move all this into ES6 syntax.
var E2eHelpers = require('../util/e2e-helpers');
var Timeouts = require('../util/timeouts.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    // Ensure introduction page renders.
    client
      .url(E2eHelpers.baseUrl)
      .waitForElementVisible('body', Timeouts.normal);

    client.end();
  });

