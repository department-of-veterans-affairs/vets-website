HTMLElement.prototype.vaButtonGetByText = function vaButtonGetByText(
  buttonText,
) {
  return this.querySelector(`va-button[text="${buttonText}"]`);
};
