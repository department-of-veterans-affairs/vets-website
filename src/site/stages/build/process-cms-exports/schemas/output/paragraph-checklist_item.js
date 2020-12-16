module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-checklist_item'] },
    entityType: { enum: ['paragraph'] },
    entityBundle: { enum: ['checklist_item'] },
    fieldSectionIntro: { type: 'string' },
    fieldSectionHeader: { type: 'string' },
    fieldChecklistItems: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['entity'],
};
