/* eslint-disable valid-typeof */

/**
 * Checks if the number of focusable and tabbable elements are correct.
 * This is a simple equality check, to make sure the right number of
 * elements can be reached by pressing TAB or through programmatic
 * focus with the JS .focus() method.
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.assert.isAllyDeepEquals("body", true);
 *  };
 * ```
 *
 * @method isAllyDeepEqual
 * @param {string} [selector] The selector (CSS / Xpath) used to locate the element
 * @param {boolean} [balanceBool] True if page has no no tabIndex="-1"
 * @api assertions
 */
exports.assertion = function isAllyDeepEquals(selector, balanceBool) {
  this.message = balanceBool
    ? `${selector} returned equal arrays of tabbable and focusable elements`
    : `${selector} returned unequal arrays of tabbable and focusable elements`;

  this.expected = balanceBool;
  this.pass = value => value === this.expected;
  this.value = result => result.value[0] === result.value[1];
  this.command = callback => this.api.allyDeepEquals(selector, callback);
};
