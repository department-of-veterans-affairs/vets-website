/**
 * Clears the current value and if |value| is specified,
 *  enters the |value| in.
 */
exports.command = function fill(selector, value, callback) {
  this.removeText(selector);
  if (typeof value !== 'undefined') {
    // When callback is passed as undefined, setValue assumes selector is the locating strategy
    if (typeof callback !== 'undefined') {
      this.setValue(selector, value, callback);
    } else {
      this.setValue(selector, value);
    }
  }

  return this;
};
