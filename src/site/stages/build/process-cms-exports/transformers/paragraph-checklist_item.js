const transform = entity => ({
  contentModelType: entity.contentModelType,
  entity: {
    entityType: 'paragraph',
    entityBundle: 'checklist_item',
    fieldSectionIntro: entity.fieldSectionIntro,
    fieldSectionHeader: entity.fieldSectionHeader,
    fieldChecklistItems: entity.fieldChecklistItems,
  },
});

module.exports = {
  filter: [
    'field_section_intro',
    'field_section_header',
    'field_checklist_items',
  ],
  transform,
};
