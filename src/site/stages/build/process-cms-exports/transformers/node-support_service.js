const { getDrupalValue, createLink } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'support_service',
    title: getDrupalValue(entity.title),
    fieldLink: createLink(entity.fieldLink),

    fieldPhoneNumber: getDrupalValue(entity.fieldPhoneNumber),
  },
});
module.exports = {
  filter: ['title', 'field_link', 'field_phone_number'],
  transform,
};
