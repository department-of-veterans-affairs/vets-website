/* eslint-disable func-names, prefer-arrow-callback */

/**
 * Evaluate radio buttons for basic reverse keyboard functionality:
 *
 * Radio groups can receive keyboard focus by pressing TAB
 * Each radio button can be checked from bottom to top by pressing
 * the UP or LEFT arrow keys.
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.evaluateRadioButtonsReverse([
 *      "input[type="radio"]#1",
 *      "input[type="radio"]#2",
 *      "input[type="radio"]#3"
 *    ], client.Keys.ARROW_UP);
 *  };
 * ```
 *
 * @method evaluateRadioButtonsReverse
 * @param {string} [selectorArray] The array of radio buttons to be evaluated
 * @param {object} [arrowPressed] Nightwatch Keys object. Expects ARROW_UP || ARROW_LEFT.
 * @api commands
 */
exports.command = function evaluateRadioButtonsReverse(
  selectorArray,
  arrowPressed,
) {
  const arrLength = selectorArray.length;
  const element = selectorArray[0];
  const client = this;

  return client.waitForElementPresent(element, 1000, function() {
    for (let i = arrLength - 1; i >= 0; i -= 1) {
      this.keys(arrowPressed).assert.isActiveElement(selectorArray[i]);
    }
  });
};
