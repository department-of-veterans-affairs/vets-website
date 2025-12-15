/**
 * Set value directly on the web component and dispatch change event
 * Alternative to fillData function for certain elements
 *
 * @param {Enzyme} form The enzyme object that contains a form
 * @param {string} selector The selector to find the input to fill
 * @param {string} value The data to fill in the input
 */
export function fillDataDirectly(form, selector, value) {
  const element = form.getDOMNode().querySelector(selector);
  if (element) {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
