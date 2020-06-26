const linkTeaser = require('./paragraph-link_teaser');

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
          items: linkTeaser,
        },
      },
      required: ['fieldTitle', 'fieldVaParagraphs'],
    },
  },
  required: ['entity'],
};
