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
 * @param {string} selectorArray The array of checkboxes by (CSS / Xpath) to be evaluated.
 * @api commands
 */
exports.command = function allyEvaluateCheckboxes(selectorArray) {
  const { SPACE, TAB } = this.Keys;
  const client = this;
  const element = selectorArray[0];

  return client.waitForElementPresent(element, 1000, function() {
    selectorArray.forEach((sel, i) => {
      this.assert
        .isActiveElement(sel)
        .keys(SPACE)
        .assert.attributeContains(element, 'checked', 'true');

      if (i < selectorArray.length - 1) {
        client.keys(TAB);
      }
    });
  });
};
