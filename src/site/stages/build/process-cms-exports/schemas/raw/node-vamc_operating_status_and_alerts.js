/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    moderation_state: { $ref: 'GenericNestedString' },
    metatag: { $ref: 'GenericNestedString' },
    path: { $ref: 'GenericNestedString' },
    field_banner_alert: { $ref: 'GenericNestedString' },
    field_facility_operating_status: { $ref: 'GenericNestedString' },
    field_links: { $ref: 'GenericNestedString' },
    field_office: { $ref: 'GenericNestedString' },
    field_operating_status_emerg_inf: { $ref: 'GenericNestedString' },
  },
  required: [
    'title',
    'moderation_state',
    'metatag',
    'path',
    'field_banner_alert',
    'field_facility_operating_status',
    'field_links',
    'field_office',
    'field_operating_status_emerg_inf',
  ],
};
