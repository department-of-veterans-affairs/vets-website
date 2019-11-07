/* eslint-disable camelcase */
const entityReference = {
  type: 'object',
  properties: {
    target_type: { type: 'string' },
    target_uuid: { type: 'string', format: 'uuid' },
  },
  required: ['target_type', 'target_uuid'],
};

const entityReferenceArray = {
  type: 'array',
  items: {
    $ref: 'EntityReference',
  },
};

module.exports = {
  entityReference,
  entityReferenceArray,
};
