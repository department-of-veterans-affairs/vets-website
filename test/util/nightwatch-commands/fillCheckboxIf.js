/**
 * The first parameter is the field name, not the whole selector.
 */
exports.command = function fillCheckboxIf(selector, condition, ...params) {
  let shouldClick = !!condition;
  if (typeof condition === 'function') {
    shouldClick = !!condition(...params);
  }

  if (shouldClick) {
    this.fillCheckbox(selector);
  } else {
    // Needs to call some nightwatch function anyhow to queue this
    // http://nightwatchjs.org/guide/#extending
    this.perform(() => {});
  }

  return this;
};
