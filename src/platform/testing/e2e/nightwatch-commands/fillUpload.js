/**
 * Fills an upload document element.
 *
 * @param {string} inputId id of input[type=file]
 * @param {string} dirname directory of the pdf
 * @param {string} file name of the file
 */
exports.command = function fillUpload(inputId, dirname, file) {
  const selector = `input[id="${inputId}"]`;
  this.waitForElementPresent(selector, 1000)
    .pause(1000)
    .setValue(selector, require('path').resolve(`${dirname}/${file}`));
  // .click('#submit')
  // .pause(1000);

  return this;
};
