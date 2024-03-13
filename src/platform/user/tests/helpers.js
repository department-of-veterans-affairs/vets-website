import { render } from '@testing-library/react';

/**
 *
 * @param {*} component A React component or HTML
 * @param {*} options
 * @param {*} options.isWrapped Defaults to 'false', only use when the componet is wrapped with react-testing-library
 * @returns
 */
export function renderComponentForA11y(component, { isWrapped = false } = {}) {
  const parentNode = document.createElement('div');

  if (isWrapped) {
    document.body.appendChild(parentNode);
    parentNode.innerHTML = component.innerHTML;
    return parentNode.children[0];
  }

  const { container } = render(component);
  document.body.appendChild(parentNode);
  parentNode.innerHTML = container.innerHTML;
  return parentNode.children[0];
}
