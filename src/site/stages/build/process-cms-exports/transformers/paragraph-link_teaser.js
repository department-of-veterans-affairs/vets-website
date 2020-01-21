const { getDrupalValue, createLink } = require('./helpers');

const transform = entity => ({
  entity: {
    fieldLink: createLink(entity.fieldLink),
    fieldLinkSummary: getDrupalValue(entity.fieldLinkSummary),
  },
});

module.exports = {
  filter: ['field_link', 'field_link_summary'],
  transform,
};
