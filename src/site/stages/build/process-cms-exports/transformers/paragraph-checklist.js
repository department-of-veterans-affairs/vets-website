const transform = entity => ({
  contentModelType: entity.contentModelType,
  entity: {
    entityType: 'paragraph',
    entityBundle: 'checklist',
    fieldChecklistSections: entity.fieldChecklistSections,
  },
});

module.exports = {
  filter: ['field_checklist_sections'],
  transform,
};
