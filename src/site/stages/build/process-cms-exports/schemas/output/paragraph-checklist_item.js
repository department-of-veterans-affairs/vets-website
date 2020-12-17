module.exports = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['checklist_item'] },
        fieldSectionIntro: { type: ['string', 'null'] },
        fieldSectionHeader: { type: ['string', 'null'] },
        fieldChecklistItems: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: [
        'entityBundle',
        'entityType',
        'fieldChecklistItems',
        'fieldSectionHeader',
        'fieldSectionIntro',
      ],
    },
  },
  required: ['entity'],
};
