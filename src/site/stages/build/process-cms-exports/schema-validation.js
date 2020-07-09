/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const path = require('path');

const validate = require('./validator');
const { getContentModelType, getAllImportsFrom } = require('./helpers');

// Read all the schemas
const rawSchemasDir = path.join(__dirname, 'schemas', 'input');
const transformedSchemasDir = path.join(__dirname, 'schemas', 'output');

const validateEntityFactory = schemasDir => {
  /**
   * { page: { <schema> }, ... }
   */
  const schemas = getAllImportsFrom(schemasDir);

  const missingSchemas = new Set();

  /**
   * @param {Object} entity - The entity before reference expansion
   * @return {Array<Object>} - An array of all the validation errors.
   *                           Empty if none are found. This may
   *                           actually only find the first validation
   *                           error, not all errors.
   */
  return entity => {
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
};

module.exports = {
  validateRawEntity: validateEntityFactory(rawSchemasDir),
  validateTransformedEntity: validateEntityFactory(transformedSchemasDir),
};
