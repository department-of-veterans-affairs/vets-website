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

export const selectVaRadio = (container, label) => {
  const changeEvent = new CustomEvent('selected', {
    detail: { value: label },
  });
  $('va-radio', container).__events.vaValueChange(changeEvent);
};
