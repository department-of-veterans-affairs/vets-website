/* eslint-disable func-names, prefer-arrow-callback */

/**
 * Evaluate modal windows for basic keyboard open and close functionality:
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client
      .allyEvaluateModalWindow(
        'button[aria-label="Learn more about VA education and training programs"]',
        'div[role="alertdialog"]',
        'button[aria-label="Close this modal"]',
        ENTER,
      );
 *  };
 * ```
 *
 * @method allyEvaluateModalWindow
 * @param {string} modalTrigger The selector (CSS / Xpath) used to open the modal window.
 * @param {string} modalElement The selector (CSS / Xpath) of the modal container.
 * @param {string} modalCloseElement The selector (CSS / Xpath) used to close the modal window.
 * @param {object} [triggerKey] The client.Keys.KEY being pressed to open and close the modal window. Default key is ENTER.
 * @param {number} [timeoutNum] Value in milliseconds to wait for a selector. Default is 2000.
 * @api commands
 */
module.exports.command = function allyEvaluateModalWindow(
  modalTrigger,
  modalElement,
  modalCloseElement,
  triggerKey = this.Keys.ENTER,
  timeoutNum = 2000,
) {
  const client = this;

  return client.waitForElementPresent(modalTrigger, timeoutNum, function() {
    this.assert
      .isActiveElement(modalTrigger)
      .keys(triggerKey)
      .waitForElementVisible(modalElement, 1000)
      .assert.isActiveElement(modalCloseElement)
      .keys(triggerKey)
      .assert.isActiveElement(modalTrigger);
  });
};
