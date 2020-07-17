const { getDrupalValue, getWysiwygString } = require('./helpers');

function wysiwygTransform(entity) {
  const { fieldWysiwyg } = entity;

  return {
    entity: {
      entityType: 'paragraph',
      entityBundle: 'wysiwyg',

      fieldWysiwyg: {
        processed: getWysiwygString(getDrupalValue(fieldWysiwyg)),
      },
    },
  };
}

module.exports = {
  filter: ['field_wysiwyg'],
  transform: wysiwygTransform,
};
