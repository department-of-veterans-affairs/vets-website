/**
 * Clears the current value and if |value| is specified,
 *  enters the |value| in.
 */
exports.command = function fill(selector, value) {
  this.clearValue(selector);
  if (typeof value !== 'undefined') {
    this.setValue(selector, value);
  }

  return this;
};
