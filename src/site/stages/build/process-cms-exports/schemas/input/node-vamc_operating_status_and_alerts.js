/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    status: { $ref: 'GenericNestedBoolean' },
    metatag: { $ref: 'RawMetaTags' },
    path: { $ref: 'RawPath' },
    field_banner_alert: {
      type: 'array',
      items: {
        oneOf: [
          // No idea why this is a thing, but sometimes we get empty arrays
          // instead of entity references. We filter them out in the
          // transformer.
          { type: 'array', maxItems: 0 },
          { $ref: 'EntityReference' },
        ],
      },
    },
    field_facility_operating_status: { $ref: 'EntityReferenceArray' },
    field_links: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string' },
          title: { type: 'string' },
          // When we actually get an item, add the schema to this and remove the maxItems: 0
          options: { type: 'array', maxItems: 0 },
        },
        required: ['uri', 'title'],
      },
    },
    field_office: {
      type: 'array',
      items: { $ref: 'EntityReference' },
      maxItems: 1,
    },
    field_operating_status_emerg_inf: { $ref: 'GenericNestedString' },
  },
  required: [
    'title',
    'status',
    'metatag',
    'path',
    'field_banner_alert',
    'field_facility_operating_status',
    'field_links',
    'field_office',
    'field_operating_status_emerg_inf',
  ],
};
