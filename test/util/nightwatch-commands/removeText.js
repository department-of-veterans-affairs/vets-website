exports.command = function removeText(selector) {
  if (this.options.desiredCapabilities.browserName === 'internet explorer') {
    this
      .getValue(selector, (result) => {
        if (result.value) {
          result.value.split('').forEach(() => {
            this.setValue(selector, this.Keys.DELETE);
          });
        }
      });
  } else {
    this.clearValue(selector);
  }
  return this;
};
