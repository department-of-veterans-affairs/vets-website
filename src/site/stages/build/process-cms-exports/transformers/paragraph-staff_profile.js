const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'staff_profile',
    fieldStaffProfile: getDrupalValue(entity.fieldStaffProfile),
  },
});
module.exports = {
  filter: ['field_staff_profile'],
  transform,
};
