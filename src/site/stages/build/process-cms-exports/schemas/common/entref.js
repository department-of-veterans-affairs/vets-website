/* eslint-disable camelcase */

/**
 * Options available for the entref function.
 * @typedef EntRefOptions
 * @property {number} maxItems - The maximum number of entities found in the reference array
 * @property {number} minItems - The minimum number of entities found in the reference array
 */

/**
 * @type EntRefOptions
 */
const defaultOptions = {
  maxItems: 1,
  minItems: 1,
};

/**
 * Create a schema for an entity reference dynamically.
 * @param {String} targetType - The target_type found in the CMS export for the entity reference
 * @param {EntRefOptions} options - Optional parameters
 */
const entref = (targetType, options = defaultOptions) => ({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      target_type: { type: 'string', enum: [targetType] },
      target_uuid: { type: 'string' },
    },
    required: ['target_type', 'target_uuid'],
  },
  maxItems: options.maxItems,
  minItems: options.minItems,
});

module.exports = entref;
