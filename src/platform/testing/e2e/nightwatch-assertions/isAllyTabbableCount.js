/**
 * Checks if the count of focusable elements is correct. Focusable elements are those
 * in the normal tab order (native focusable elements or those with tabIndex <= 0), and
 * those elements with a tabIndex="-1".
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.assert.isAllyTabbableCount("body", 10, "Your custom message");
 *  };
 * ```
 *
 * @method isAllyTabbableCount
 * @param {string} [selector] The selector (CSS / Xpath) used to locate the element
 * @param {number} [count] The number of tabbable elements on the page
 * @param {string} [message] Optional log message displayed in output. Defaults to this.message.
 * @api assertions
 */
exports.assertion = function isAllyTabbableCount(selector, count, msg) {
  this.message =
    msg ||
    `[ALLY.JS] Page contained the expected number of tabbable elements: ${count}`;
  this.expected = parseInt(count, 10);
  this.pass = value => value === this.expected;
  this.value = result => result.value.length;
  this.command = callback =>
    this.api.allyCheckTabbableCount(selector, callback);
};
