/* eslint-disable func-names, prefer-arrow-callback */

/**
 * Evaluate select menus for basic keyboard functionality:
 *
 * Each select can receive keyboard focus by pressing TAB.
 * Select menus should open with SPACE press, and user
 * should be able to enter keys. This is an imperfect
 * approximation, but Nightwatch doesn't support arrow
 * keys for traversing options in the open select.
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.allyevaluateSelectMenu('selector', 'option text', 'option value');
 *  };
 * ```
 *
 * @method allyevaluateSelectMenu
 * @param {string} selectMenu The selector (CSS / Xpath) used to locate the element.
 * @param {string} optionText The text of the <option> that should be selected.
 * @param {string} selectedOption Value attribute of the <option> that should be selected.
 * @param {number} [timeoutNum] Value in milliseconds to wait for a selector. Default is 2000.
 * @api commands
 */

module.exports.command = function allyevaluateSelectMenu(
  selectMenu,
  optionText,
  selectedOption,
  timeoutNum = 2000,
) {
  const client = this;

  return client.waitForElementPresent(selectMenu, timeoutNum, function() {
    this.assert
      .isActiveElement(selectMenu)
      .sendKeys(selectMenu, optionText)
      .assert.value(selectMenu, selectedOption);
  });
};
