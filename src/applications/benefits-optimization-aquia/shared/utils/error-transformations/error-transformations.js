/**
 * Error transformations for VA components
 */

/**
 * Creates a normalizer function that filters out invalid error patterns
 * and normalizes error values to strings.
 * @param {Array<string>} [invalidPatterns=[]] - Array of error messages to filter out
 * @returns {Function} Normalizer function
 */
const createNormalizer = (invalidPatterns = []) => {
  return error => {
    if (!error) return null;
    if (invalidPatterns.includes(error)) return null;
    return typeof error === 'string' ? error.trim() || null : String(error);
  };
};

/**
 * Creates default error props for VA components with optional extra properties.
 * @param {Object} [extraProps={}] - Additional properties to merge with defaults
 * @returns {Function} Function that generates error props
 */
const createDefaultErrorProps = (extraProps = {}) => {
  return (error, _touched, _forceShow) => ({
    error,
    'aria-invalid': error ? 'true' : 'false',
    ...extraProps,
  });
};

export const ERROR_TRANSFORMATIONS = {
  'va-text-input': {
    normalizeError: createNormalizer(['Invalid input', 'Invalid']),
    getErrorProps: createDefaultErrorProps({ noValidate: true }),
  },

  'va-select': {
    normalizeError: createNormalizer(),
    getErrorProps: createDefaultErrorProps(),
  },

  'va-textarea': {
    normalizeError: createNormalizer(),
    getErrorProps: createDefaultErrorProps(),
  },

  'va-checkbox': {
    normalizeError: createNormalizer(),
    getErrorProps: createDefaultErrorProps(),
  },

  'va-checkbox-group': {
    normalizeError: createNormalizer(),
    getErrorProps: createDefaultErrorProps(),
  },

  'va-radio': {
    normalizeError: createNormalizer(),
    getErrorProps: createDefaultErrorProps(),
  },

  'va-date': {
    normalizeError: createNormalizer(),
    getErrorProps: createDefaultErrorProps(),
  },

  'va-memorable-date': {
    normalizeError: createNormalizer(['Invalid input', 'Invalid']),
    getErrorProps: createDefaultErrorProps(),
  },

  'va-telephone-input': {
    normalizeError: createNormalizer(['Invalid input', 'Invalid']),
    getErrorProps: createDefaultErrorProps(),
  },
};
