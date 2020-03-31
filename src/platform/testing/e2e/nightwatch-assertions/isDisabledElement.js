/**
 * Checks if the given element is disabled on the page.
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.assert.isDisabledElement("disabled?" false);
 *  };
 * ```
 *
 * @method isDisabledElement
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {boolean} disabled Pass boolean true if this element should be disabled, or false if not.
 * @param {string} [message] Optional log message to override "Testing if element that matches ${selector} is disabled".
 * @api assertions
 */

exports.assertion = function isDisabledElement(selector, disabled, message) {
  this.message =
    message || `Testing if element that matches ${selector} is disabled.`;
  this.expected = disabled;
  this.pass = value => value === this.expected;
  this.value = result => result.value;
  this.command = callback => this.api.checkDisabledElement(selector, callback);
};
