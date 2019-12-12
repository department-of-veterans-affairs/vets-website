const { getDrupalValue, uriToUrl } = require('./helpers');

function transform(entity) {
  const { fieldLink, fieldLinkSummary } = entity;
  const { uri, title, options } = fieldLink[0] || {};

  const transformed = {
    entity: {
      fieldLink: fieldLink[0]
        ? {
            url: { path: uriToUrl(uri) },
            title,
            options,
          }
        : null,
      fieldLinkSummary: getDrupalValue(fieldLinkSummary),
    },
  };

  return transformed;
}

module.exports = {
  filter: ['field_link', 'field_link_summary'],
  transform,
};
