module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_region_detail_page'] },
    entityBundle: { enum: ['health_care_region_detail_page'] },
    title: { type: 'string' },
    changed: { type: 'number' },
    entityPublished: { type: 'boolean' },
    entityUrl: { $ref: 'EntityUrl' },
    fieldAlert: { type: ['string', 'null'] },
    fieldContentBlock: {
      type: 'array',
      items: { $ref: 'Paragraph' },
    },
    fieldFeaturedContent: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'Paragraph' },
    },
    fieldIntroText: { type: 'string' },
    fieldOffice: {
      oneOf: [
        {
          type: 'object',
          properties: {
            entity: { $ref: 'output/node-health_care_region_page' },
          },
        },
        {
          type: 'object',
          properties: {
            entity: { $ref: 'output/node-office' },
          },
        },
        { type: 'null' },
      ],
    },
    fieldRelatedLinks: {
      oneOf: [
        { $ref: 'output/paragraph-list_of_link_teasers' },
        { type: 'null' },
      ],
    },
    fieldTableOfContentsBoolean: { type: 'boolean' },
  },
  required: [
    'title',
    'changed',
    'entityPublished',
    'entityUrl',
    'fieldAlert',
    'fieldContentBlock',
    'fieldFeaturedContent',
    'fieldIntroText',
    'fieldOffice',
    'fieldRelatedLinks',
    'fieldTableOfContentsBoolean',
  ],
};
