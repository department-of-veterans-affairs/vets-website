/* eslint-disable func-names, prefer-arrow-callback */

const ally = require('ally.js');

/**
 * Checks for the number of focusable elements on the page,
 * using the ally.query.tabbable method:
 * https://allyjs.io/api/query/focusable.html
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
      const focusableItems = ally.query.focusable({
        context: sel,
        includeContext: true,
        strategy: 'strict',
      });

      return focusableItems;
    },
    [selector],
    callback,
  );
};
