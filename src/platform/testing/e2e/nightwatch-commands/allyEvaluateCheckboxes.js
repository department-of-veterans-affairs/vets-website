/* eslint-disable func-names, prefer-arrow-callback */

/**
 * Evaluate checkboxes for basic keyboard functionality:
 *
 * Each checkbox can receive keyboard focus by pressing TAB
 * Each checkbox can be toggled by pressing SPACE
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.allyEvaluateCheckboxes([
 *      "input[type="checkbox"]#1",
 *      "input[type="checkbox"]#2",
 *      "input[type="checkbox"]#3"
 *    ]);
 *  };
 * ```
 *
 * @method allyEvaluateCheckboxes
 * @param {string} [selectorArray] The array of checkboxes to be evaluated
 * @api commands
 */
exports.command = function allyEvaluateCheckboxes(selectorArray) {
  const { TAB } = this.Keys;
  const arrLength = selectorArray.length;
  const element = selectorArray[0];
  const client = this;

  return client.waitForElementPresent(element, 1000, function() {
    for (let i = 0; i < arrLength; i += 1) {
      this.assert
        .isActiveElement(selectorArray[i])
        .keys(this.Keys.SPACE)
        .assert.attributeContains(element, 'checked', 'true');

      if (i < arrLength - 1) {
        client.keys(TAB);
      }
    }
  });
};
