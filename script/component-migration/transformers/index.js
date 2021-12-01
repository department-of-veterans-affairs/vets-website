const alertBoxReplacement = require('./alertbox').alertBoxReplacement;
const loadingIndicatorReplacement = require('./loadingindicator')
  .loadingIndicatorReplacement;
const progressBarReplacement = require('./progressbar').progressBarReplacement;

module.exports = {
  AlertBox: alertBoxReplacement,
  LoadingIndicator: loadingIndicatorReplacement,
  ProgressBar: progressBarReplacement,
};
