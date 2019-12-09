const { getDrupalValue } = require('./helpers');

/**
 * This is currently a dummy function, but we may
 * need it in the future to convert weird uris like
 * `entity:node/27` to something resembling a
 * relative url
 */
function uriToUrl(uri) {
  return uri;
}

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
