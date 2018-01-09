/**
 * Checks if the given element is focused on the page.
 *
 * ```
 *    this.demoTest = function (client) {
 *      client.checkActiveElement(".should_be_focused", callback);
 *    };
 * ```
 *
 * @method checkActiveElement
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api commands
 */
exports.command = function checkActiveElement(callback) {
  return this.elementActive(function (result) {// eslint-disable-line func-names
    this.elementIdAttribute(result.value.ELEMENT, 'class', callback);
  });
};
