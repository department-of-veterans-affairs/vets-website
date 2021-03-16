module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-list_of_links'] },
    entityType: { enum: ['paragraph'] },
    entityBundle: { enum: ['list_of_links'] },
    entity: {
      type: 'object',
      properties: {
        fieldLink: {
          type: ['object', 'null'],
          properties: {
            uri: { type: 'string' },
            title: { type: 'string' },
          },
        },
        fieldLinks: {
          type: ['array', 'null'],
          items: {
            type: 'object',
            properties: {
              uri: { type: 'string' },
              title: { type: 'string' },
            },
          },
        },
        fieldSectionHeader: { type: ['string', 'null'] },
      },
      required: ['fieldSectionHeader', 'fieldLink', 'fieldLinks'],
    },
  },
  required: ['entity'],
};
