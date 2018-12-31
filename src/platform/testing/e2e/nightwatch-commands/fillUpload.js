/**
 * Fills an upload document element.
 *
 * @param {string} baseName The start of the field name for the name elements
 * @param {object} name The name object
 */
exports.command = function fillName(dirname, file) {
  this.waitForElementVisible('input#fileUpload', 1000)
    .pause(1000)
    .setValue('input#fileUpload', require('path').resolve(`${dirname}/${file}`))
    .click('#submit')
    .pause(1000);

  return this;
};
