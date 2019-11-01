const validate = require('./validator');
const { getContentModelType } = require('./helpers');
const page = require('./schemas/page');

const schemas = {
  page,
};

const missingSchemas = new Set();

/**
 * @param {Object} entity - The entity before reference expansion
 * @return {Array<Object>} - An array of all the validation errors.
 *                           Empty if none are found. This may
 *                           actually only find the first validation
 *                           error, not all errors.
 */
const validateEntity = entity => {
  // Find the validation object
  const contentModelType = getContentModelType(entity);
  const schema = schemas[contentModelType];

  // Check for missing validation
  if (!schema) {
    // Log it once
    if (!missingSchemas.has(contentModelType)) {
      missingSchemas.add(contentModelType);
      // eslint-disable-next-line no-console
      console.warn(`Missing schema for ${contentModelType}`);
    }
    // Assume it's valid
    return [];
  }

  return validate(entity, schema);
};

module.exports = validateEntity;
