/**
 * Checks if the count of focusable elements is correct. Focusable elements are those
 * in the normal tab order (native focusable elements or those with tabIndex 0).
 * The count logic will break on tabindexes > 0 because we do not want to override the
 * browser's base tab order.
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.assert.hasFocusableCount("body", 10, "Your custom message");
 *  };
 * ```
 *
 * @method hasFocusableCount
 * @param {string} [selector] The selector (CSS / Xpath) used to locate the element
 * @param {number} [count] The number of focusable elements in the selector
 * @param {string} [message] Optional log message displayed in output. Defaults to this.message.
 * @api assertions
 */
exports.assertion = function hasFocusableCount(selector, count, message) {
  this.message = message || `Page contains ${count} focusable elements.`;
  this.expected = parseInt(count, 10);
  this.pass = value => value === this.expected;
  this.value = result => parseInt(result.value.length, 10);
  this.command = callback =>
    this.api.allyCheckFocusableCount(selector, callback);
};
