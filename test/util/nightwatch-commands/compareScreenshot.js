// commands/compareScreenshot.js
export function command(filename, expected, callback) {
  const self = this;
  const screenshotPath = 'test/ui/screenshots/';
  const resultPath = `${screenshotPath}results/${filename}`;

  self.saveScreenshot(resultPath, response => {
    self.assert.compareScreenshot(filename, expected, result => {
      if (typeof callback === 'function') {
        callback.call(self, result);
      }
    });
  });

  return this; // allows the command to be chained.
}
