/**
 * Checks if the count of focusable elements is correct. Focusable elements are those
 * in the normal tab order (native focusable elements or those with tabIndex <= 0), and
 * those elements with a tabIndex="-1".
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.assert.hasTabbableCount("body", 10, "Your custom message");
 *  };
 * ```
 *
 * @method hasTabbableCount
 * @param {string} [selector] The selector (CSS / Xpath) used to locate the element
 * @param {number} [count] The number of tabbable elements on the page
 * @param {string} [message] Optional log message displayed in output. Defaults to this.message.
 * @api assertions
 */
exports.assertion = function hasTabbableCount(selector, count, msg) {
  this.message = msg || `Page contains ${count} tabbable elements.`;
  this.expected = parseInt(count, 10);
  this.pass = value => value === this.expected;
  this.value = result => parseInt(result.value.length, 10);
  this.command = callback =>
    this.api.allyCheckTabbableCount(selector, callback);
};
