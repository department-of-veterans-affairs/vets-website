/**
 * @param {number}
 * @param {function}
 */
export default function debounce(wait, func) {
  let timeoutId;

  const debouncedFunc = function debouncedFunction(...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), wait);
  };

  debouncedFunc.cancel = function cancel() {
    clearTimeout(timeoutId);
  };

  return debouncedFunc;
}
