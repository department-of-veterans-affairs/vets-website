/**
 * Fills the name form elements.
 *
 * @param {string} baseName The start of the field name for the name elements
 * @param {object} name The name object
 */
exports.command = function fillName(baseName, name) {
  if (name.first) {
    this.fill(`input[name="${baseName}_first"]`, name.first);
  }

  if (name.middle) {
    this.fill(`input[name="${baseName}_middle"]`, name.middle);
  }

  if (name.last) {
    this.fill(`input[name="${baseName}_last"]`, name.last);
  }

  if (name.suffix) {
    this.selectDropdown(`${baseName}_suffix`, name.suffix);
  }

  return this;
};
