/* eslint-disable camelcase */
module.exports = {
  $id: 'EntityType',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      target_id: { type: 'string' },
      target_type: { type: 'string' },
      target_uuid: { type: 'string', format: 'uuid' },
    },
    required: ['target_id', 'target_type', 'target_uuid'],
  },
};
