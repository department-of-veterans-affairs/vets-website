/* eslint-disable func-names, prefer-arrow-callback */

const ally = require('ally.js');

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
      const tabbableItems = ally.query.tabbable({
        context: sel,
        includeContext: true,
        strategy: 'strict',
      });

      return tabbableItems;
    },
    [selector],
    callback,
  );
};
