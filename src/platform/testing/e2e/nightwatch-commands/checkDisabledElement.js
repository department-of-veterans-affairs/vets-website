/**
 * @method checkDisabledElement
 * @param {string} [selector] The selector (CSS / Xpath) used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @returns {boolean}
 * @api commands
 */
exports.command = function checkDisabledElement(selector, callback) {
  return this.execute(
    sel => {
      const target = document.querySelector(sel);
      const disabledTarget = target.getAttribute('disabled');

      return disabledTarget !== null;
    },
    [selector],
    callback,
  );
};
