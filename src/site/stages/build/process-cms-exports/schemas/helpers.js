/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');

// TODO: Profile this to see if we should memoize it
function getAllSchemasOfType(type) {
  const transformedSchemasDir = path.join(__dirname, 'transformed');
  return fs
    .readdirSync(transformedSchemasDir)
    .filter(fileName => fileName.startsWith(`${type}-`))
    .map(fileName => {
      const schemaPath = path.join(transformedSchemasDir, fileName);
      const schema = require(schemaPath);
      schema.$contentModelType =
        schema.$contentModelType || path.basename(fileName, '.js');
      return schema;
    });
}

const paragraph = () => ({
  anyOf: getAllSchemasOfType('paragraph').concat([{ type: 'object' }]),
});

const blockContent = () => ({
  anyOf: getAllSchemasOfType('block_content').concat([{ type: 'object' }]),
});

const media = () => ({
  anyOf: getAllSchemasOfType('media').concat([{ type: ['object', 'null'] }]),
});

/**
 * Options available for the entref function.
 * @typedef EntRefOptions
 * @property {number} maxItems - The maximum number of entities found in the reference array
 * @property {number} minItems - The minimum number of entities found in the reference array
 */

/**
 * @type EntRefOptions
 */
const defaultEntRefOptions = {
  maxItems: 1,
  minItems: 1,
};

module.exports = {
  getAllSchemasOfType,

  /**
   * Create a schema for an entity reference dynamically.
   * @param {String} targetType - The target_type found in the CMS export for the entity reference
   * @param {EntRefOptions} options - Optional parameters
   * @returns {Object} - The entity reference for targetType
   */
  entref: (targetType, options = defaultEntRefOptions) => ({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        /* eslint-disable camelcase */
        target_type: { type: 'string', enum: [targetType] },
        target_uuid: { type: 'string' },
        /* eslint-enable camelcase */
      },
      required: ['target_type', 'target_uuid'],
    },
    maxItems: options.maxItems,
    minItems: options.minItems,
  }),

  paragraph,

  blockContent,

  media,
};
