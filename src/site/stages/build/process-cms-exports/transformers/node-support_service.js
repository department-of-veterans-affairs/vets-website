const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'support_service',
    title: getDrupalValue(entity.title),
    fieldLink: {
      url: {
        path: entity.fieldLink[0].uri,
      },
      title: entity.fieldLink[0].title,
      options: entity.fieldLink[0].options,
    },
    fieldPhoneNumber: getDrupalValue(entity.fieldPhoneNumber),
  },
});
module.exports = {
  filter: ['title', 'field_link', 'field_phone_number'],
  transform,
};
