const GiHelpers = require('./gibct-helpers');
const Timeouts = require('platform/testing/e2e/timeouts');

const selectOJTType = client => {
  client.selectRadio('category', 'employer');
  client.axeCheck('.main');
};

/**
 * Verifies the Housing Rate for "Will be working" when selecting an option
 * @param client
 * @param option working dropdown selection
 * @param housingRate expected housing rate
 */
const willBeWorking = (client, option, housingRate) => {
  client.waitForElementVisible(GiHelpers.housingRateId, Timeouts.normal);
  client.selectDropdown('working', option);
  GiHelpers.calculateBenefits(client);
  client.assert.containsText(GiHelpers.housingRateId, `$${housingRate}/mo`);
};

module.exports = {
  selectOJTType,
  willBeWorking,
};
