const { getDrupalProcessed, getWysiwygString } = require('./helpers');

function wysiwygTransform(entity) {
  const { fieldWysiwyg } = entity;

  return {
    entity: {
      entityType: 'paragraph',
      entityBundle: 'wysiwyg',
      fieldWysiwyg: {
        processed: getWysiwygString(getDrupalProcessed(fieldWysiwyg)),
      },
    },
  };
}

module.exports = {
  filter: ['field_wysiwyg'],
  transform: wysiwygTransform,
};
