const validator = require('./validator');
const { getContentModelType } = require('./helpers');
const page = require('./schemas/page');

const schemas = {
  page,
};

const missingSchemas = new Set();

/**
 * @param {String} entityType - The type of entity; corresponds to the
 *                              name of the file.
 * @param {Object} entity - The entity before reference expansion
 * @return {Boolean} - True if the entity is valid
 * @throws {Exception} - An exception with the list of validation
 *                       errors if there are any
 */
const validateEntity = (entityType, entity) => {
  // Find the validation object
  const contentModelType = getContentModelType(entityType, entity);
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
    return { valid: true };
  }

  return validator.validate(entity, schema);
};

module.exports = validateEntity;
