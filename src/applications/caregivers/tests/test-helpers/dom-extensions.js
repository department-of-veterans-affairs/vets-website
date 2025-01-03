import { fireEvent } from '@testing-library/react';

HTMLElement.prototype.vaButtonGetByText = function vaButtonGetByText(
  buttonText,
) {
  return this.querySelector(`va-button[text="${buttonText}"]`);
};

HTMLElement.prototype.vaSearchInputGetByLabel = function inputVaSearchInput(
  labelText,
) {
  const vaSearchInput = this.querySelector(
    `va-search-input[label="${labelText}"]`,
  );

  vaSearchInput.input = function input(value) {
    this.value = value;

    const event = new CustomEvent('input', {
      bubbles: true,
      detail: { value },
    });
    this.dispatchEvent(event);

    return this;
  };

  vaSearchInput.submit = function submit() {
    const submitEvent = new CustomEvent('submit', { bubbles: true });
    fireEvent(this, submitEvent);

    return this;
  };

  return vaSearchInput;
};
