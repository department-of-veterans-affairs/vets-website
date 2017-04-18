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
  }

  return this;
};
