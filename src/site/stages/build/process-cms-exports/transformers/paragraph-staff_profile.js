const { isPublished, getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'staff_profile',
    queryFieldStaffProfile: {
      entities: [entity.fieldStaffProfile[0] || null],
    },
    entityPublished: isPublished(getDrupalValue(entity.status)),
  },
});
module.exports = {
  filter: ['field_staff_profile', 'status'],
  transform,
};
