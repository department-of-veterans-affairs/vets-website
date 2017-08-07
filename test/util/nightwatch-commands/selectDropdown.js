/**
 * The first parameter is the field name, not the whole selector.
 */
exports.command = function selectDropdown(name, value) {
  this.click(`select[name='${name}'] option[value='${value}']`);
};
