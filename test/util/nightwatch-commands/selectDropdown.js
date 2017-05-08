/**
 * For chaining selecting dropdowns
 * Note: This takes the field name, not the whole selector.
 */
exports.command = function selectDropdown(name, value) {
  const select = `select[name='${name}']`;
  this.execute((clientSelect, clientValue) => {
    /* eslint-disable */
    var element = document.querySelector(clientSelect);
    var event = new Event('change', { bubbles: true });
    element.value = clientValue;
    element.dispatchEvent(event);
    return element.value;
    /* eslint-disable */
  },
  [select, value]);

  return this;
};
