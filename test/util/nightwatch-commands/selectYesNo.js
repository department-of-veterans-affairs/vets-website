/**
 * Selects the appropriate option for yesNo widgets.
 *
 * @param {String} fieldName The name of the field without Yes or No
 *                           e.g. root_spouseInfo_divorcePending
 * @param {bool} condition Determines whether to select Yes or No
 */
exports.command = function selectYesNo(fieldName, condition) {
  const target = `input[name="${fieldName}${condition ? 'Yes' : 'No'}"]`;
  if (this.options.desiredCapabilities.browserName === 'internet explorer') {
    this.sendKeys(target, this.Keys.SPACE);
  } else {
    this.click(target);
  }
};
