const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'staff_profile',
    queryFieldStaffProfile: {
      entities: [entity.fieldStaffProfile[0] || null],
    },
  },
});
module.exports = {
  filter: ['field_staff_profile'],
  transform,
};
