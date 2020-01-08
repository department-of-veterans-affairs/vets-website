/**
 * Checks if the count of focusable elements is correct. Focusable elements are those
 * in the normal tab order (native focusable elements or those with tabIndex <= 0).
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.assert.isAllyFocusableCount("body", 10, "Your custom message");
 *  };
 * ```
 *
 * @method isAllyFocusableCount
 * @param {string} [selector] The selector (CSS / Xpath) used to locate the element
 * @param {number} [count] The number of focusable elements on the page
 * @param {string} [message] Optional log message displayed in output. Defaults to this.message.
 * @api assertions
 */
exports.assertion = function isAllyFocusableCount(selector, count, message) {
  this.message =
    message ||
    `[ALLY.JS] Page contained the expected number of focusable elements: ${count}`;
  this.expected = parseInt(count, 10);
  this.pass = value => value.value.length === this.expected;
  this.value = result => result;
  this.command = callback =>
    this.api.allyCheckFocusableCount(selector, callback);
};
