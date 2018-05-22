/**
 * @param {number}
 * @param {function}
 */
export default function debounce(wait, func) {
  let timeoutId;

  return function debouncedFunction(...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), wait);
  };
}
