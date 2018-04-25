// https://davidwalsh.name/javascript-debounce-function
// Refactored from example to take advantage of ES6 syntax
export default function _debounce(func, wait, immediate) {
  // Time to wait in milliseconds
  let timeout;

  return (...args) => {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;

    // Clear any existing timeouts
    clearTimeout(timeout);

    // Execute after timeout period
    timeout = setTimeout(later, wait);

    // If callNow evaluates true, execute immediately
    // Not recommended for resource-intensive events like resize
    if (callNow) {
      func.apply(this, args);
    }
  };
}
