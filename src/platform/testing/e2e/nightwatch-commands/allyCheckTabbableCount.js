/* eslint-disable func-names, prefer-arrow-callback */

/**
 * Checks for the number of tabbable elements on the page,
 * using the ally.query.tabbable method:
 * https://allyjs.io/api/query/focusable.html
 *
 * "Tabbable" means the element or elements can receive
 * keyboard focus natively by pressing `TAB` or `SHIFT + TAB`.
 *
 * @method allyCheckTabbableCount
 * @param {string} [selector] The selector (CSS / Xpath) used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @returns {array} The array of tabbable elements found in the selector.
 * @api commands
 */
exports.command = function allyCheckTabbableCount(selector, callback) {
  return this.execute(
    function(sel) {
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
