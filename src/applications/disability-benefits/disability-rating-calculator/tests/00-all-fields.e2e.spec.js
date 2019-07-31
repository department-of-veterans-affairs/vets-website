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
    .assert.title('How VA Assigns Disability Ratings | Veterans Affairs');

  // Test row deletion.
  // TODO: Cover edge-case* for deleting AFTER calculating combined rating.
  // *Design Team to decide what should happen for this edge-case.
  client
    .waitForElementPresent('.btn-add', Timeouts.slow)
    .expect.element('.btn-add').to.be.visible;
  DrcE2eHelpers.fillRatings(client, { ratings: [30, 20, 10] });
  client
    .waitForElementVisible('.row-3 .btn-delete', Timeouts.normal)
    .click('.row-2 .btn-delete');
  client.elements('css selector', '.ratingInput', result => {
    client.assert.equal(result.value.length, 2);
  });
  client
    .waitForElementVisible('.btn-clearall', Timeouts.normal)
    .click('.btn-clearall');

  // Test combined-rating calculations / input error.
  for (const input of inputs) {
    client
      .waitForElementVisible('.rating.row-2', Timeouts.normal)
      .expect.element('.rating.row-2 .ratingInput').to.be.visible;

    DrcE2eHelpers.fillRatings(client, input);
    client
      .waitForElementVisible('.btn-calculate', Timeouts.normal)
      .click('.btn-calculate');

    if (DrcE2eHelpers.ratingsAreAllRounded(input.ratings)) {
      // Check calculation -- ratings are all rounded.
      client
        .waitForElementVisible('.combined-rating', Timeouts.slow)
        .expect.element('.combined-rating')
        .text.to.contain(input.combinedRating.rounded.toString());
    } else {
      // Check error -- ratings are not all rounded.
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
