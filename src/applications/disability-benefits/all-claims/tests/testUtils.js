import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

/**
 * Input a string value into a va-text-input component.
 * @param {any} container - React Testing Library container
 * @param {string} value - String value to enter in the input field
 * @param {string} selector - select or element
 */
export const inputVaTextInput = (
  container,
  value,
  selector = 'va-text-input',
) => {
  const vaTextInput = $(selector, container);
  vaTextInput.value = value;

  const event = new CustomEvent('input', {
    bubbles: true,
    detail: { value },
  });
  vaTextInput.dispatchEvent(event);
};

/**
 * Select a checkbox within a given group
 * @param {object} checkboxGroup - element containing the group
 * @param {string} keyName - unique key
 */
export const checkVaCheckbox = (checkboxGroup, keyName) => {
  checkboxGroup.__events.vaChange({
    target: {
      checked: true,
      dataset: { key: keyName },
    },
    detail: { checked: true },
  });
};
