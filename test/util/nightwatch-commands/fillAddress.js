/**
 * Fills the address form elements.
 */
exports.command = function fillAddress(baseName, address) {
  this
    .selectDropdown(`${baseName}_country`, address.country)
    .fill(`input[name="${baseName}_street"]`, address.street)
    .fill(`input[name="${baseName}_street2"]`, address.street2)
    .fill(`input[name="${baseName}_city"]`, address.city)
    .selectDropdown(`${baseName}_state`, address.state)
    .fill(`input[name="${baseName}_postalCode"]`, address.postalCode);

  return this;
};
