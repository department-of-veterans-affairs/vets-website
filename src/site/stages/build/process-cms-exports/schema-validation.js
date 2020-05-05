/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const path = require('path');

const validate = require('./validator');
const { getContentModelType } = require('./helpers');

// Read all the schemas
const rawSchemasDir = path.join(__dirname, 'schemas', 'raw');
const transformedSchemasDir = path.join(__dirname, 'schemas', 'transformed');

const validateEntityFactory = schemasDir => {
  /**
   * { page: { <schema> }, ... }
   */
  const schemas = fs
    .readdirSync(schemasDir)
    .filter(name => name.endsWith('.js'))
    .reduce((s, fileName) => {
      const contentModelType = fileName.slice(0, -3); // Take of the '.js'
      // eslint-disable-next-line no-param-reassign
      s[contentModelType] = require(path.join(schemasDir, fileName));
      return s;
    }, {});

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
