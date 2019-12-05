const { getDrupalValue, getWysiwygString } = require('./helpers');

function wysiwygTransform(entity) {
  const { fieldWysiwyg } = entity;

  const transformed = {
    entity: {
      entityType: 'paragraph',
      entityBundle: 'wysiwyg',

      fieldWysiwyg: {
        processed: getWysiwygString(getDrupalValue(fieldWysiwyg)),
      },
    },
  };

  return transformed;
}

module.exports = {
  filter: ['field_wysiwyg'],
  transform: wysiwygTransform,
};
