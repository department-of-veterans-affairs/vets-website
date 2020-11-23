/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    field_body: { $ref: 'GenericNestedString' },
    field_regional_health_service: {
      type: 'array',
      items: { $ref: 'EntityReference' },
      maxItems: 1,
    },
    field_service_location: { $ref: 'EntityReferenceArray' },
    field_online_scheduling_availabl: { $ref: 'GenericNestedString' },
    field_referral_required: { $ref: 'GenericNestedString' },
    field_walk_ins_accepted: { $ref: 'GenericNestedString' },
    field_phone_numbers_paragraph: { $ref: 'EntityReferenceArray' },
  },
  required: [
    'title',
    'field_body',
    'field_regional_health_service',
    'field_service_location',
    'field_online_scheduling_availabl',
    'field_referral_required',
    'field_walk_ins_accepted',
    'field_phone_numbers_paragraph',
  ],
};
