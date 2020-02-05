/* eslint-disable func-names, prefer-arrow-callback */

const focusable = import('ally.js/query/focusable');
const tabbable = import('ally.js/query/tabbable');

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
      focusable({
        context: sel,
        includeContext: true,
        strategy: 'strict',
      });

      tabbable({
        context: sel,
        includeContext: true,
        strategy: 'strict',
      });

      const comparator = [focusable.length, tabbable.length];

      return comparator;
    },
    [selector],
    callback,
  );
};
