/**
 * Fills the address form elements.
 *
 * @param {string} baseName The start of the field name for the address elements
 * @param {object} address The address object
 */
exports.command = function fillAddress(baseName, address) {
  if (address.country) {
    this.selectDropdown(`${baseName}_country`, address.country);
  }

  if (address.street) {
    this.fill(`input[name="${baseName}_street"]`, address.street);
  }

  if (address.street2) {
    this.fill(`input[name="${baseName}_street2"]`, address.street2);
  }

  if (address.city) {
    this.fill(`input[name="${baseName}_city"]`, address.city);
  }

  if (address.state) {
    this.selectDropdown(`${baseName}_state`, address.state);
  }

  if (address.postalCode) {
    this.fill(`input[name="${baseName}_postalCode"]`, address.postalCode);
  }

  return this;
};
