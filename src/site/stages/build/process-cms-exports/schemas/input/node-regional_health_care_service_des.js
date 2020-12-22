/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    field_body: { $ref: 'GenericNestedString' },
    field_service_name_and_descripti: {
      $ref: 'EntityReferenceArray',
    },
    field_local_health_care_service_: {
      $ref: 'EntityReferenceArray',
    },
  },
  required: [
    'field_body',
    'field_service_name_and_descripti',
    'field_local_health_care_service_',
  ],
};
