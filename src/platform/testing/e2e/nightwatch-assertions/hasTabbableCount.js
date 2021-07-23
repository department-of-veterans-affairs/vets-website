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
        const allItems = target.querySelectorAll(
          'a[href], button, details, input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="tel"], input[type="url"], input[type="radio"]:checked, input[type="checkbox"], select, textarea, [tabindex]:not([tabindex="-1"]',
        );
        return Array.from(allItems).filter(el => !el.hasAttribute('disabled'));
      },
      [selector],
      callback,
    );
};
