const transform = entity => ({
  contentModelType: entity.contentModelType,
  entity: {
    entityType: 'paragraph',
    entityBundle: 'checklist_item',
    fieldSectionIntro: entity.fieldSectionIntro?.[0]?.value || null,
    fieldSectionHeader: entity.fieldSectionHeader?.[0]?.value || null,
    fieldChecklistItems: entity.fieldChecklistItems.map(
      checklistItem => checklistItem.value,
    ),
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
