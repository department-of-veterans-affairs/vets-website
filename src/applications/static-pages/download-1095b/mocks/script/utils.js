/**
 * delays a response by a given amount of seconds
 *
 * @param {!function} cb - callback function to fire after delay
 * @param {?number} delay - time to delay response in seconds (default: 3)
 */
const delaySingleResponse = (cb, delay = 3) => {
  setTimeout(() => {
    cb();
  }, delay * 1000);
};

module.exports = {
  delaySingleResponse,
};
