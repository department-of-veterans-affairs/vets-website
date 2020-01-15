module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-health_care_region_detail_page'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['health_care_region_detail_page'] },
    title: { type: 'string' },
    changed: { type: 'number' },
    entityUrl: {
      type: 'object',
      // TODO: Add breadcrumb here
      properties: {
        path: { type: 'string' },
      },
      required: ['path'],
    },
    fieldAlert: { type: ['string', 'null'] },
    fieldContentBlock: {
      type: 'array',
      items: { $ref: 'Paragraph' },
    },
    fieldFeaturedContent: { type: 'array' },
    fieldIntroText: { type: 'string' },
    // This isn't a full transformed/node-office entity because we only want some of the items in it
    fieldOffice: {
      type: 'object',
      properties: {
        entity: {
          type: 'object',
          properties: {
            entityLabel: { type: 'string' },
            fieldNicknameForThisFacility: { type: 'string' },
            title: { type: 'string' },
          },
          required: ['entityLabel', 'fieldNicknameForThisFacility', 'title'],
        },
      },
      required: ['entity'],
    },
    fieldRelatedLinks: {
      oneOf: [
        { $ref: 'transformed/paragraph-list_of_link_teasers' },
        { type: 'null' },
      ],
    },
    fieldTableOfContentsBoolean: { type: 'boolean' },
  },
  required: [
    'title',
    'changed',
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
