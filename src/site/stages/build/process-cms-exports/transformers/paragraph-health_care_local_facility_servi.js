const { getDrupalValue, getWysiwygString } = require('./helpers');

const transform = entity => {
  const { fieldWysiwyg, fieldTitle } = entity;
  return {
    entity: {
      entityBundle: 'health_care_local_facility_servi',
      fieldWysiwyg: {
        processed: getWysiwygString(getDrupalValue(fieldWysiwyg)),
      },
      fieldTitle: getDrupalValue(fieldTitle),
    },
  };
};

module.exports = {
  filter: ['field_wysiwyg', 'field_title'],
  transform,
};
