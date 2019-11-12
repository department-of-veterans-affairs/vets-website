const { getDrupalValue } = require('./helpers');

function wysiwygTransform(entity) {
  const { fieldWysiwyg } = entity;

  const transformed = Object.assign({}, entity, {
    entityType: 'paragraph',
    entityBundle: 'wysiwyg',

    fieldWysiwyg: {
      processed: getDrupalValue(fieldWysiwyg),
    },
  });

  return transformed;
}

module.exports = wysiwygTransform;
