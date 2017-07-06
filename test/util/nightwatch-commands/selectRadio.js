/**
 * Selects the appropriate option for yesNo widgets.
 *
 * @param {String} fieldName The name of the field without Yes or No
 *                            e.g. root_spouseInfo_divorcePending
 * @param {bool} value       The value to select
 */
exports.command = function selectRadio(fieldName, value) {
  this.click(`input[name^="${fieldName}"][value="${value}"]`);
};
