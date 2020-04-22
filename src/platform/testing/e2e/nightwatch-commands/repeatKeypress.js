/* eslint-disable func-names, prefer-arrow-callback */

/**
 * Allow test writers to build a shorthand for multiple keypresses.
 * This is a common part of keyboard navigation, especially when
 * users have to press TAB several times to move through a group
 * of checkboxes or form elements.
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.repeatKeypress(client.Keys.TAB, 3);
 *  };
 * ```
 *
 * @method repeatKeypress
 * @param {object} key The Selenium key to press. Formatted Client.Keys.KEY.
 * @param {number} pressCount Number of times to press the key.
 * @param {number} [pauseTime] The `waitTime` in milliseconds. Default is 125ms.
 * @api commands
 */
module.exports.command = function repeatKeypress(
  key,
  pressCount,
  pauseTime = 125,
) {
  const client = this;

  return client.pause(pauseTime, () => {
    for (let i = 0; i < pressCount; i++) {
      this.keys(key);
    }
  });
};
