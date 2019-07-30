const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts.js');
// const DrcHelpers = require('../utils/helpers.js');
// const ENVIRONMENTS = require('site/constants/environments');
// const FormsTestHelpers = require('platform/testing/e2e/form-helpers');
const inputs = require('./utils/inputs.json');
const DrcE2eHelpers = require('./drc-helpers.js');

module.exports = E2eHelpers.createE2eTest(client => {
  // Navigate to beta-page.
  client
    .openUrl(`${E2eHelpers.baseUrl}/disability/about-disability-ratings-beta/`)
    .waitForElementVisible('body', Timeouts.normal)
    .assert.title('How VA Assigns Disability Ratings | Veterans Affairs')
    .waitForElementVisible('.usa-content > h1:first-child', Timeouts.slow)
    .assert.containsText(
      '.usa-content > h1:first-child',
      'How VA assigns disability ratings',
    );

  // Fill-out ratings & check result/error.
  for (const input of inputs) {
    client
      .waitForElementVisible('.rating.row-1', Timeouts.normal)
      .expect.element('.rating.row-1 .ratingInput').to.be.visible;

    DrcE2eHelpers.fillRatings(client, input);
    client
      .waitForElementVisible('.btn-calculate', Timeouts.normal)
      .click('.btn-calculate');

    if (DrcE2eHelpers.ratingsAreAllRounded(input.ratings)) {
      // Check result.
      client
        .waitForElementVisible('.combined-rating', Timeouts.slow)
        .expect.element('.combined-rating')
        .text.to.contain(input.combinedRating.rounded.toString());
    } else {
      // Check error.
      client.expect
        .element('.usa-input-error-message')
        .to.be.visible.before(1000);
    }

    // Reset.
    client
      .waitForElementVisible('.btn-clearall', Timeouts.normal)
      .click('.btn-clearall');
  }

  client.end();
});
