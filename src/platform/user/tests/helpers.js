import { render } from '@testing-library/react';

/**
 *
 * Examples:
 * ```
 * // If normal React component (aka not wrapped by RTL or RTL helpers)
 * it('should be accessible for normal React component', async () => {
 *    const component = renderComponentForA11y(<ComponentName />)
 *    await expect(component).to.be.accessible();
 * })
 *
 * // If using a wrapped component (wrapped by RTL, or our helpers that require the router and/or redux)
 * it('should be accessible for RTL helper component', async () => {
 *    const { container } = renderWithStoreAndRouter(<ProfileAlert />, {
 *      path: PROFILE_PATHS.PROFILE_ROOT,
 *    });
 *    const component = renderComponentForA11y(container, { isWrapped: true });
 *    await expect(component).to.be.accessible();
 * })
 * ```
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
