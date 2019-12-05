const { getDrupalValue, getWysiwygString } = require('./helpers');

const transform = entity => {
  const { fieldWysiwyg, fieldTextExpander } = entity;
  return {
    entity: {
      entityBundle: 'expandable_text',
      fieldWysiwyg: {
        processed: getWysiwygString(getDrupalValue(fieldWysiwyg)),
      },
      fieldTextExpander: getDrupalValue(fieldTextExpander),
    },
  };
};

module.exports = {
  filter: ['field_wysiwyg', 'field_text_expander'],
  transform,
};
