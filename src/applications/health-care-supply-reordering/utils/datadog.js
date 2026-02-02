/**
 * Safely add a Datadog RUM action if DD_RUM is initialized
 * @param {string} name - The action name
 * @param {Object} context - The action context/attributes
 */
export const addDatadogAction = (name, context) => {
  window.DD_RUM?.addAction?.(name, context);
};

/**
 * Safely add a Datadog RUM error if DD_RUM is initialized
 * @param {Error} error - The error object
 * @param {Object} context - The error context/attributes
 */
export const addDatadogError = (error, context) => {
  window.DD_RUM?.addError?.(error, context);
};
