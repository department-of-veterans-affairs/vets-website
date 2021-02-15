const { getDrupalValue, getWysiwygString } = require('./helpers');

function wysiwygTransform(entity) {
  const { fieldWysiwyg } = entity;

  return {
    entity: {
      entityType: 'paragraph',
      entityBundle: 'wysiwyg',
      fieldWysiwyg: fieldWysiwyg.length
        ? {
            processed: getWysiwygString(getDrupalValue(fieldWysiwyg)),
          }
        : null,
    },
  };
}

module.exports = {
  filter: ['field_wysiwyg'],
  transform: wysiwygTransform,
};
