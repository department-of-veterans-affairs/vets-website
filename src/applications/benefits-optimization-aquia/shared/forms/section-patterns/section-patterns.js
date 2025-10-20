/**
 * Creates a custom form section hook with preset configuration.
 * Allows forms to create their own specialized section patterns.
 * Note: This returns a configuration object, not a hook.
 * The actual hook (useFormSection) should be imported and used directly.
 *
 * @param {Object} presetConfig - Preset configuration for the section
 * @returns {Function} Function that merges preset config with overrides
 */
export const createFormSectionConfig = presetConfig => {
  return (overrides = {}) => {
    return {
      ...presetConfig,
      ...overrides,
    };
  };
};

/**
 * Utility to combine multiple data processors in sequence.
 * Each processor receives the output of the previous one.
 *
 * @param {...Function} processors - Data processor functions
 * @returns {Function} Combined data processor
 */
export const combineDataProcessors = (...processors) => {
  return data => {
    return processors.reduce((processedData, processor) => {
      return processor ? processor(processedData) : processedData;
    }, data);
  };
};

/**
 * Creates a conditional data processor that runs based on a condition.
 *
 * @param {Function} condition - Condition function that receives data
 * @param {Function} processor - Processor to run if condition is true
 * @returns {Function} Conditional data processor
 */
export const conditionalProcessor = (condition, processor) => {
  return data => {
    if (condition(data)) {
      return processor(data);
    }
    return data;
  };
};
