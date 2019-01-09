/**
 * Repeat a series of actions until a condition is met.
 */
exports.command = function repeatWhile(conditionFunction, repeatFunction) {
  if (conditionFunction()) {
    this.perform(() => repeatFunction());
  } else {
    this.perform(() => {});
  }

  return this;
};
