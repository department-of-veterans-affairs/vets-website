/* eslint-disable camelcase */
module.exports = {
  $id: 'EntityReference',
  type: 'object',
  properties: {
    target_type: { type: 'string' },
    target_uuid: { type: 'string', format: 'uuid' },
  },
  required: ['target_type', 'target_uuid'],
};
