const alertBoxReplacement = require('./alertbox').alertBoxReplacement;
const loadingIndicatorReplacement = require('./loadingindicator')
  .loadingIndicatorReplacement;
const segmentedProgressBarReplacement = require('./segmentedprogressbar')
  .segmentedProgressBarReplacement;

module.exports = {
  AlertBox: alertBoxReplacement,
  LoadingIndicator: loadingIndicatorReplacement,
  SegmentedProgressBar: segmentedProgressBarReplacement,
};
