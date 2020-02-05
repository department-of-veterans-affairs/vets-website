/* eslint-disable func-names, prefer-arrow-callback */

/**
 * Evaluate inputs and textareas for basic keyboard functionality:
 *
 * We will ensure the input or textarea has focus, can take key entry,
 * and returns the value we expect.
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.evaluateInput('selector', 'input text');
 *  };
 * ```
 *
 * @method evaluateSelectMenu
 * @param {object} key The Selenium key to press. Formatted Client.Keys.KEY.
 * @param {number} pressCount Number of times to press the key.
 * @api commands
 */
module.exports.command = function repeatKeypress(key, pressCount) {
  const client = this;

  return client.pause(125, () => {
    for (let i = 0; i < pressCount; i++) {
      this.keys(key);
    }
  });
};
