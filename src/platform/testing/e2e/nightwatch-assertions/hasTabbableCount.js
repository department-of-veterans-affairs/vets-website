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
 * @param {string} selector The selector (CSS / Xpath) used to locate the element
 * @param {number} count The number of tabbable elements on the page
 * @param {string} [message] Optional log message displayed in output. Defaults to this.message.
 * @api assertions
 */
exports.assertion = function hasTabbableCount(
  selector,
  count,
  message = `Page contains ${count} tabbable elements.`,
) {
  this.message = message;
  this.expected = parseInt(count, 10);
  this.pass = value => value === this.expected;
  this.value = result => parseInt(result.value.length, 10);
  this.command = callback =>
    this.api.execute(
      sel => {
        const target = document.querySelector(sel);
        const tabbableItems = target.querySelectorAll(
          'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="email"]:not([disabled]), input[type="password"]:not([disabled]), input[type="search"]:not([disabled]), input[type="tel"]:not([disabled]), input[type="url"]:not([disabled]), input[type="radio"]:not([disabled]):checked, input[type="checkbox"]:not([disabled]), select:not([disabled]), *[tabindex="0"]',
        );

        return tabbableItems;
      },
      [selector],
      callback,
    );
};
