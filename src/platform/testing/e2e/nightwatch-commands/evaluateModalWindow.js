/* eslint-disable func-names, prefer-arrow-callback */

/**
 * Evaluate modal windows for basic keyboard open and close functionality:
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client
      .evaluateModalWindow(
        'button[aria-label="Learn more about VA education and training programs"]',
        'div[role="alertdialog"]',
        'button[aria-label="Close this modal"]',
        ENTER,
      );
 *  };
 * ```
 *
 * @method evaluateSelectMenu
 * @param {string} modalTrigger The selector (CSS / Xpath) used to open the modal window.
 * @param {string} modalElement The selector (CSS / Xpath) of the modal container.
 * @param {string} modalCloseElement The selector (CSS / Xpath) used to close the modal window.
 * @param {object} [triggerKey] The client.Keys.KEY being pressed to open and close the modal window. Default key is ENTER.
 * @api commands
 */
module.exports.command = function evaluateModalWindow(
  modalTrigger,
  modalElement,
  modalCloseElement,
  triggerKey,
) {
  const client = this;

  return client.waitForElementPresent(modalTrigger, 1000, () => {
    this.assert
      .isActiveElement(modalTrigger)
      .keys(triggerKey || client.Keys.ENTER)
      .waitForElementVisible(modalElement, 1000)
      .assert.isActiveElement(modalCloseElement)
      .keys(triggerKey || client.Keys.ENTER)
      .assert.isActiveElement(modalTrigger);
  });
};
