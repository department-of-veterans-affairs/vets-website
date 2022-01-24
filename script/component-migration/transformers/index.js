const alertBoxReplacement = require('./alertbox').alertBoxReplacement;
const loadingIndicatorReplacement = require('./loadingindicator')
  .loadingIndicatorReplacement;
const additionalInfoReplacement = require('./additionalinfo')
  .additionalInfoReplacement;

module.exports = {
  AdditionalInfo: additionalInfoReplacement,
  AlertBox: alertBoxReplacement,
  LoadingIndicator: loadingIndicatorReplacement,
};
