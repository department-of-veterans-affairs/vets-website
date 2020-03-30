/**
 * Checks if the given element is focused on the page.
 *
 * ```
 *    this.demoTest = function (client) {
 *      client.assert.isActiveElement(".should_be_focused");
 *    };
 * ```
 *
 * @method isActiveElement
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} [message] Optional log message to override "Testing if element that matches ${selector} is active".
 * @api assertions
 */
exports.assertion = function isActiveElement(selector, message) {
  this.message =
    message || `Testing if element that matches ${selector} is focused.`;
  this.expected = true;
  this.pass = value => value === this.expected;
  this.failure = result => result === false;
  this.value = result => result.value;
  this.command = callback => this.api.checkActiveElement(selector, callback);
};
