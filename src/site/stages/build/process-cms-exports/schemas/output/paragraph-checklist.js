module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['paragraph-checklist'] },
    entity: {
      type: 'object',
      properties: {
        entityType: { enum: ['paragraph'] },
        entityBundle: { enum: ['checklist'] },
        fieldChecklistSections: {
          type: 'array',
          items: { $ref: 'output/paragraph-checklist_item' },
        },
      },
      required: ['fieldChecklistSections'],
    },
  },
  required: ['entity'],
};
