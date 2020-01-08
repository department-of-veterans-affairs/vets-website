/* eslint-disable func-names, prefer-arrow-callback */

const ally = require('ally.js');

/**
 * Checks if the objects of focusable and tabbable elements are equal.
 * This is useful for pages that might include tabindex="-1" on one or
 * more elements. In that case, we'd expect the two objects not to be
 * equal. All other cases assume objects should be equal.
 * https://allyjs.io/api/query/focusable.html
 *
 * "Tabbable" means the element or elements can receive
 * keyboard focus natively by pressing `TAB` or `SHIFT + TAB`,
 * and elements that have a tabindex="-1" attribute, and can be
 * focused programmatically.
 *
 * @method allyDeepEquals
 * @param {string} [selector] The selector (CSS / Xpath) used to locate the element.
 * @returns {array} [comparator] The array objects for focusable, and tabbable elements.
 * @api commands
 */
exports.command = function allyDeepEquals(selector, callback) {
  return this.execute(
    function(sel) {
      const focusableItems = ally.query.focusable({
        context: sel,
        includeContext: true,
        strategy: 'strict',
      });

      const tabbableItems = ally.query.tabbable({
        context: sel,
        includeContext: true,
        strategy: 'strict',
      });

      const comparator = [focusableItems.length, tabbableItems.length];

      return comparator;
    },
    [selector],
    callback,
  );
};
