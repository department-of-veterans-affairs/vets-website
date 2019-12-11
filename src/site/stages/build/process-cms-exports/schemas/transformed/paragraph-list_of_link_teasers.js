module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-list_of_link_teasers'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['list_of_link_teasers'] },
        fieldTitle: { type: ['string', 'null'] },
        fieldVaParagraphs: {
          type: 'array',
          items: { $ref: 'transformed/paragraph-link_teaser' },
        },
      },
      required: ['fieldTitle', 'fieldVaParagraphs'],
    },
  },
  required: ['entity'],
};
