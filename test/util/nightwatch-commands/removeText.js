exports.command = function removeText(selector) {
  this
    .getValue(selector, (result) => {
      if (result.value) {
        result.value.split('').forEach(() => {
          this.setValue(selector, this.Keys.DELETE);
        });
      }
    });

  return this;
};
