// eslint-disable-next-line func-names
HTMLElement.prototype.vaButtonGetByText = function(buttonText) {
  return this.querySelector(`va-button[text="${buttonText}"]`);
};
