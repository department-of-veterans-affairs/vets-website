/* eslint-disable func-names, prefer-arrow-callback */

const ally = require('ally.js');

/**
 * Checks if the given element is focused on the page.
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.checkActiveElement(".should_be_focused", callback);
 *  };
 * ```
 *
 * @method checkActiveElement
 * @param {string} [selector] The selector (CSS / Xpath) used to locate the element.
 * @param {boolean} [disabled] Value expected for ally.is.disabled() assertion.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @returns {boolean}
 * @api commands
 */
exports.command = function allyCheckDisabled(selector, disabled, callback) {
  return this.execute(
    function(sel) {
      const target = document.querySelector(sel);
      const disabledTarget = ally.is.disabled(target);

      return disabledTarget;
    },
    [selector, disabled],
    callback,
  );
};
