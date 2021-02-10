const { getDrupalValue, createLink } = require('./helpers');

const transform = entity => ({
  entity: {
    fieldLink: createLink(entity.fieldLink),
    fieldLinkSummary: getDrupalValue(entity.fieldLinkSummary),
    parentFieldName: getDrupalValue(entity.parentFieldName),
  },
});

module.exports = {
  filter: ['field_link', 'field_link_summary', 'parent_field_name'],
  transform,
};
