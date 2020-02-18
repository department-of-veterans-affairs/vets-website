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
 * @param {string} selector The selector (CSS / Xpath) used to locate the element
 * @param {number} count The number of focusable elements in the selector
 * @param {string} [message] Optional log message displayed in output. Defaults to this.message.
 * @api assertions
 */
exports.assertion = function hasFocusableCount(
  selector,
  count,
  message = `Page contains ${count} focusable elements.`,
) {
  this.message = message;
  this.expected = parseInt(count, 10);
  this.pass = value => value === this.expected;
  this.value = result => parseInt(result.value.length, 10);
  this.command = callback =>
    this.api.execute(
      sel => {
        const target = document.querySelector(sel);
        const focusableItems = target.querySelectorAll(
          'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="email"]:not([disabled]), input[type="password"]:not([disabled]), input[type="search"]:not([disabled]), input[type="tel"]:not([disabled]), input[type="url"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), *[tabindex="0"], *[tabindex="-1"]',
        );

        return focusableItems;
      },
      [selector],
      callback,
    );
};
