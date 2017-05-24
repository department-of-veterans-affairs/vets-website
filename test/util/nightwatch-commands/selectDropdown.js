/**
 * Change select value and trigger change event programatically. This
 * is necessary because long select boxes tend to render offscreen,
 * causing Selenium to fail in unexpected ways.
 * The first parameter is the field name, not the whole selector.
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
