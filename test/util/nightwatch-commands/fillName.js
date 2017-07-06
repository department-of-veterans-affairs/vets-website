/**
 * Fills the name form elements.
 */
exports.command = function fillName(schemaformBaseName, name) {
  this
    .fill(`input[name="${schemaformBaseName}_first"]`, name.first)
    .fill(`input[name="${schemaformBaseName}_middle"]`, name.middle)
    .fill(`input[name="${schemaformBaseName}_last"]`, name.last)
    .selectDropdown(`${schemaformBaseName}_suffix`, name.suffix);

  return this;
};
