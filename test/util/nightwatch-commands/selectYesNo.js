/**
 * Selects the appropriate option for yesNo widgets.
 *
 * @param {String} fieldName The name of the field without Yes or No
 *                           e.g. root_spouseInfo_divorcePending
 * @param {bool} condition Determines whether to select Yes or No
 */
exports.command = function selectYesNo(fieldName, condition) {
  this.click(`input[name="${fieldName}${condition ? 'Yes' : 'No'}"]`);
};
