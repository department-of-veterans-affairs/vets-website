import { within } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

export const getByBrokenText = (text, container) => {
  return within(container).getByText((content, node) => {
    const hasText = childNode => childNode.textContent === text;
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node.children).every(
      child => !hasText(child),
    );

    return nodeHasText && childrenDontHaveText;
  });
};

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

export const selectVaSelect = (container, value, selector = 'va-select') => {
  const changeEvent = new CustomEvent('vaSelect', {
    detail: { value },
  });
  $(selector, container).__events.vaSelect(changeEvent);
};

export const selectVaDate = (container, value, selector = 'va-date') => {
  const vaDate = $(selector, container);
  vaDate.value = value;
  const event = new CustomEvent('dateChange', {
    bubbles: true,
    detail: { value },
  });
  vaDate.dispatchEvent(event);
};

export const selectVaRadio = (container, value, selector = 'va-radio') => {
  const changeEvent = new CustomEvent('selected', {
    detail: { value },
  });
  $(selector, container).__events.vaValueChange(changeEvent);
};

export const checkVaCheckbox = (checkboxGroup, bool) => {
  checkboxGroup.__events.vaChange({
    target: {
      checked: bool,
    },
    detail: { checked: bool },
  });
};
