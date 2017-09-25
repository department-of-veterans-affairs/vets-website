/**
 * The first parameter is the field name, not the whole selector.
 */
exports.command = function fillCheckbox(selector) {
  this.sendKeys(selector, this.Keys.SPACE);
};
