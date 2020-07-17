const GiHelpers = require('./gibct-helpers');

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
  client.selectDropdown('working', option);
  GiHelpers.calculateBenefits(client);
  GiHelpers.checkProfileHousingRate(client, housingRate);
};

module.exports = {
  selectOJTType,
  willBeWorking,
};
