const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'staff_profile',
    queryFieldStaffProfile: {
      entities: [entity.fieldStaffProfile[0] || null],
    },
    // Unpublished person nodes will still have status == true here
    // So we need to make sure we have fieldStaffProfile data instead.
    entityPublished: !!entity.fieldStaffProfile[0],
  },
});
module.exports = {
  filter: ['field_staff_profile'],
  transform,
};
