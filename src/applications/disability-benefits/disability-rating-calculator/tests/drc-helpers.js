const Timeouts = require('platform/testing/e2e/timeouts.js');

function addRatingRow(client) {
  const addRowBtnSelector = 'button[data-e2e=add]';

  client
    .waitForElementVisible(addRowBtnSelector, Timeouts.normal)
    .click(addRowBtnSelector);
}

function fillRatings(client, input) {
  const { ratings } = input;
  const ratingsLength = ratings.length;

  for (let x = 0; x < ratingsLength; x++) {
    const currRating = ratings[x];
    /* eslint-disable prefer-template */
    const getCurrRowClass = () => '.rating.row-' + (x + 1);
    /* eslint-enable prefer-template */

    if (x > 1) {
      addRatingRow(client);
    }

    client
      .waitForElementVisible(getCurrRowClass(), Timeouts.normal)
      .fill(`${getCurrRowClass()} .ratingInput`, currRating);
  }
}

function ratingsAreAllRounded(ratings) {
  for (const rating of ratings) {
    if (rating % 10 !== 0) {
      return false;
    }
  }

  return true;
}

module.exports = {
  addRatingRow,
  fillRatings,
  ratingsAreAllRounded,
};
