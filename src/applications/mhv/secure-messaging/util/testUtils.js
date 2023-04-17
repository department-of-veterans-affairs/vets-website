import { within } from '@testing-library/react';

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
