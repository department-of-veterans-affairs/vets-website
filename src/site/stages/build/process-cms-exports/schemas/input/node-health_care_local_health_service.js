/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    field_body: { $ref: 'GenericNestedString' },
    field_regional_health_service: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_service_location: { $ref: 'EntityReferenceArray' },
    field_hservice_appt_leadin: { $ref: 'GenericNestedString' },
    field_hservice_appt_intro_select: { $ref: 'GenericNestedString' },
    field_online_scheduling_availabl: { $ref: 'GenericNestedString' },
    field_referral_required: { $ref: 'GenericNestedString' },
    field_walk_ins_accepted: { $ref: 'GenericNestedString' },
    field_phone_numbers_paragraph: { $ref: 'EntityReferenceArray' },
    field_facility_location: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
  },
  required: [
    'title',
    'field_body',
    'field_regional_health_service',
    'field_service_location',
    'field_hservice_appt_leadin',
    'field_hservice_appt_intro_select',
    'field_online_scheduling_availabl',
    'field_referral_required',
    'field_walk_ins_accepted',
    'field_phone_numbers_paragraph',
    'field_facility_location',
  ],
};
