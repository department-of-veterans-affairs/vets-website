/* eslint-disable func-names, prefer-arrow-callback */

/**
 * Evaluate radio buttons for basic forward keyboard functionality:
 *
 * Radio groups can receive keyboard focus by pressing TAB
 * Each radio button can be checked by pressing the DOWN or
 * RIGHT arrow keys.
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.evaluateRadioButtons([
 *      "input[type="radio"]#1",
 *      "input[type="radio"]#2",
 *      "input[type="radio"]#3"
 *    ], client.Keys.ARROW_DOWN);
 *  };
 * ```
 *
 * @method evaluateRadioButtons
 * @param {string} selectorArray The array of radio buttons to be evaluated
 * @param {object} arrowPressed Nightwatch Keys object. Expects ARROW_DOWN || ARROW_RIGHT.
 * @api commands
 */
exports.command = function evaluateRadioButtons(selectorArray, arrowPressed) {
  const arrLength = selectorArray.length;
  const element = selectorArray[0];
  const client = this;

  return client.waitForElementPresent(element, 1000, function() {
    for (let i = 0; i < arrLength; i += 1) {
      this.assert.isActiveElement(selectorArray[i]).keys(arrowPressed);
    }
  });
};
