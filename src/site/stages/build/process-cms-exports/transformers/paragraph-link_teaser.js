const { getDrupalValue } = require('./helpers');

function transform(entity) {
  const { fieldLink, fieldLinkSummary } = entity;
  const { uri, title, options } = fieldLink[0];

  const transformed = {
    entity: {
      entityType: 'paragraph',
      entityBundle: 'link_teaser',

      fieldLink: {
        url: { path: uri },
        title,
        options,
      },
      fieldLinkSummary: getDrupalValue(fieldLinkSummary),
    },
  };

  return transformed;
}

module.exports = transform;
