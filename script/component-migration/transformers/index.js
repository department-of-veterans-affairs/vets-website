const alertBoxReplacement = require('./alertbox').alertBoxReplacement;
const loadingIndicatorReplacement = require('./loadingindicator')
  .loadingIndicatorReplacement;
const segmentedProgressBarReplacement = require('./segmentedprogressbar')
  .segmentedProgressBarReplacement;
const additionalInfoReplacement = require('./additionalinfo')
  .additionalInfoReplacement;

module.exports = {
  AdditionalInfo: additionalInfoReplacement,
  AlertBox: alertBoxReplacement,
  LoadingIndicator: loadingIndicatorReplacement,
  SegmentedProgressBar: segmentedProgressBarReplacement,
};
