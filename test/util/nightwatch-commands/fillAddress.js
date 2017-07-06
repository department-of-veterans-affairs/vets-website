/**
 * Fills the address form elements.
 */
exports.command = function fillAddress(schemaformBaseName, address) {
  this
    .selectDropdown(`${schemaformBaseName}_country`, address.country)
    .fill(`input[name="${schemaformBaseName}_street"]`, address.street)
    .fill(`input[name="${schemaformBaseName}_street2"]`, address.street2)
    .fill(`input[name="${schemaformBaseName}_city"]`, address.city)
    .selectDropdown(`${schemaformBaseName}_state`, address.state)
    .fill(`input[name="${schemaformBaseName}_postalCode"]`, address.postalCode);

  return this;
};
