/**
 * Fills the name form elements.
 */
exports.command = function fillName(baseName, name) {
  this
    .fill(`input[name="${baseName}_first"]`, name.first)
    .fill(`input[name="${baseName}_middle"]`, name.middle)
    .fill(`input[name="${baseName}_last"]`, name.last)
    .selectDropdown(`${baseName}_suffix`, name.suffix);

  return this;
};
