/* eslint-disable func-names, prefer-arrow-callback */

/**
 * Checks for the number of focusable elements on the page,
 * using a broad query selector derived and modified from
 * this article:
 * https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
 *
 * "Focusable" means the element or elements can receive
 * keyboard focus natively by pressing `TAB` or `SHIFT + TAB`,
 * and elements that have a tabindex="-1" attribute, and can be
 * focused programmatically.
 *
 * @method allyCheckFocusableCount
 * @param {string} [selector] The selector (CSS / Xpath) used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @returns {array} The array of focusable elements found in the selector.
 * @api commands
 */
exports.command = function allyCheckFocusableCount(selector, callback) {
  return this.execute(
    function(sel) {
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
