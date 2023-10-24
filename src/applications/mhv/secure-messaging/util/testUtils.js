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

export const selectVaSelect = (container, value, selector = 'va-select') => {
  const changeEvent = new CustomEvent('selected', {
    detail: { value },
  });
  $(selector, container).__events.vaSelect(changeEvent);
};

export const selectVaDate = (container, value, selector = 'va-date') => {
  const changeEvent = new CustomEvent('selected', {
    detail: { detail: value },
  });
  $(selector, container).__events.dateChange(changeEvent);
};

export const selectVaRadio = (container, value, selector = 'va-radio') => {
  const changeEvent = new CustomEvent('selected', {
    detail: { value },
  });
  $(selector, container).__events.vaValueChange(changeEvent);
};
