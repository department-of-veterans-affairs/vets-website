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
  if (!vaTextInput) throw new Error(`Element not found: ${selector}`);

  // set the value on the component instance
  vaTextInput.value = value;

  // create and dispatch a native 'input' event
  // Using InputEvent from the container's window for happydom/jsdom compatibility
  const event = new container.ownerDocument.defaultView.InputEvent('input', {
    bubbles: true,
    composed: true,
    data: value,
  });

  vaTextInput.dispatchEvent(event);
};

export const selectVaSelect = (container, value, selector = 'va-select') => {
  const changeEvent = new CustomEvent('vaSelect', {
    detail: { value },
  });
  $(selector, container).__events.vaSelect(changeEvent);
};

export const comboBoxVaSelect = (
  container,
  value,
  selector = 'va-combo-box',
) => {
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
  const vaRadio = $(selector, container);
  const changeEvent = new CustomEvent('vaValueChange', {
    detail: { value },
  });
  vaRadio.dispatchEvent(changeEvent);
};

export const checkVaCheckbox = (checkboxGroup, bool) => {
  checkboxGroup.__events.vaChange({
    target: {
      checked: bool,
    },
    detail: { checked: bool },
  });
};

export const getProps = element => {
  let prop;
  Object.keys(element).forEach(key => {
    if (key.match(/^__react[^$]*(\$.+)$/)) {
      prop = key;
    }
  });
  return prop;
};
