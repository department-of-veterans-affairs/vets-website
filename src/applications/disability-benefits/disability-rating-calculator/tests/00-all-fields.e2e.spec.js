const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts.js');

const inputs = require('./utils/inputs.json');
const DrcE2eHelpers = require('./drc-helpers.js');

const drcPagePath = '/disability/about-disability-ratings/';

module.exports = E2eHelpers.createE2eTest(client => {
  const componentSelector =
    'div[data-widget-type="disability-rating-calculator"]';
  const deleteRowBtnSelector = 'button[data-e2e=delete]';
  const inputSelector = '.ratingInput';
  const calculateBtnSelector = 'button[data-e2e=calculate]';
  const combinedRatingSelector = 'div[data-e2e="combined-rating"]';
  const clearBtnSelector = 'button[data-e2e=clearall]';
  const rowDeletionTestInput = {
    ratings: [10, 20, 30],
    combinedRating: {
      exact: 50,
      rounded: 50,
    },
  };

  // Navigate to beta-page and wait for component render.
  client
    .openUrl(`${E2eHelpers.baseUrl}${drcPagePath}`)
    .waitForElementPresent(componentSelector, Timeouts.slow)
    .axeCheck();

  // Test row deletion.
  DrcE2eHelpers.fillRatings(client, rowDeletionTestInput);
  client
    .waitForElementVisible(`.row-3 ${deleteRowBtnSelector}`, Timeouts.normal)
    .click(`.row-2 ${deleteRowBtnSelector}`);
  client.elements('css selector', inputSelector, result => {
    client.assert.equal(result.value.length, 2);
  });
  client
    .waitForElementVisible(clearBtnSelector, Timeouts.normal)
    .click(clearBtnSelector);

  // Test combined-rating result/error and reset.
  for (const input of inputs) {
    client
      .waitForElementVisible('.rating.row-2', Timeouts.normal)
      .expect.element(`.rating.row-2 ${inputSelector}`).to.be.visible;

    DrcE2eHelpers.fillRatings(client, input);
    client
      .waitForElementVisible(calculateBtnSelector, Timeouts.normal)
      .click(calculateBtnSelector);

    if (DrcE2eHelpers.ratingsAreAllRounded(input.ratings)) {
      // Check calculation -- ratings are all rounded.
      client
        .waitForElementVisible(combinedRatingSelector, Timeouts.slow)
        .expect.element(combinedRatingSelector)
        .text.to.contain(input.combinedRating.rounded.toString());
    } else {
      // Check error -- ratings are not all rounded.
      client.expect
        .element('.usa-input-error-message')
        .to.be.visible.before(Timeouts.normal);
    }

    // Test reset.
    client
      .waitForElementVisible(clearBtnSelector, Timeouts.normal)
      .click(clearBtnSelector);

    if (inputs.indexOf(input) === 0) {
      client.expect
        .element(`.rating.row-1 ${inputSelector}`)
        .to.have.value.that.equals('');
      client.expect
        .element(`.rating.row-2 ${inputSelector}`)
        .to.have.value.that.equals('');
      client.expect.element('.rating.row-3').to.not.be.present;
    }
  }

  client.end();
});
