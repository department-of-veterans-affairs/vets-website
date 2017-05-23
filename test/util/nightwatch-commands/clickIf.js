/**
 * Clicks the input specified if the condition evaluates to true.
 */
exports.command = function clickIf(selector, condition, ...params) {
  let shouldClick = !!condition;
  if (typeof condition === 'function') {
    shouldClick = !!condition(...params);
  }

  if (shouldClick) {
    this.click(selector);
  } else {
    // Needs to call some nightwatch function anyhow to queue this
    // http://nightwatchjs.org/guide/#extending
    this.perform(() => {});
  }

  return this;
};
