const { getDrupalValue, uriToUrl } = require('./helpers');

const transform = entity => {
  const { fieldLink } = entity;
  const { uri, title, options } = fieldLink[0] || {};

  return {
    entity: {
      entityType: 'node',
      entityBundle: 'support_service',
      title: getDrupalValue(entity.title),
      fieldLink: fieldLink[0]
        ? {
            url: { path: uriToUrl(uri) },
            title,
            options,
          }
        : null,

      fieldPhoneNumber: getDrupalValue(entity.fieldPhoneNumber),
    },
  };
};
module.exports = {
  filter: ['title', 'field_link', 'field_phone_number'],
  transform,
};
