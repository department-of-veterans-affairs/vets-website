/**
 * Checks if the given element is disabled on the page.
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.assert.isActiveElement(".should_be_focused");
 *  };
 * ```
 *
 * @method isAllyDisabledElement
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

exports.assertion = function isAllyDisabledElement(selector, outcome) {
  this.message = outcome
    ? `[ALLY.JS] ${selector} was disabled`
    : `[ALLY.JS] ${selector} was not disabled`;
  this.expected = outcome;
  this.pass = value => value === this.expected;
  this.value = result => result.value;
  this.command = callback =>
    this.api.allyCheckDisabled(selector, outcome, callback);
};
